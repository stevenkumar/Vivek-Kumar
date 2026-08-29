import { readJson, writeJson } from '../store.js'

const PROJECTS_FILE = 'projects.json'

const readProjects = () => readJson(PROJECTS_FILE, [])
const writeProjects = (projects) => writeJson(PROJECTS_FILE, projects)

/**
 * Extracts preview thumbnail image from a web URL using OpenGraph metadata
 * with fallback to Microlink screenshot generator.
 */
export const extractPreviewImage = async (targetUrl) => {
  if (!targetUrl || typeof targetUrl !== 'string') return ''

  let cleanUrl = targetUrl.trim()
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`
  }

  try {
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(5000),
    })

    const html = await response.text()

    const ogMatch =
      html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
    if (ogMatch && ogMatch[1]) {
      return resolveUrl(ogMatch[1], cleanUrl)
    }

    const twMatch =
      html.match(/<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i)
    if (twMatch && twMatch[1]) {
      return resolveUrl(twMatch[1], cleanUrl)
    }

    const linkMatch = html.match(/<link\s+[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i)
    if (linkMatch && linkMatch[1]) {
      return resolveUrl(linkMatch[1], cleanUrl)
    }
  } catch (err) {
    console.warn(`Preview metadata extraction skipped for ${cleanUrl}: ${err.message}`)
  }

  return `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&embed=screenshot.url`
}

const resolveUrl = (relativeOrAbsolute, base) => {
  try {
    return new URL(relativeOrAbsolute, base).toString()
  } catch {
    return relativeOrAbsolute
  }
}

/**
 * GET /api/projects - List all projects
 */
export const getProjects = (req, res, next) => {
  try {
    const projects = readProjects()
    res.json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/projects/admin/fetch-preview - Fetch image preview for any URL
 */
export const fetchPreviewImage = async (req, res, next) => {
  try {
    const { url } = req.body
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' })
    }

    const imageUrl = await extractPreviewImage(url)
    res.json({ success: true, imageUrl })
  } catch (error) {
    res.json({
      success: true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a5647e?w=1000&auto=format&fit=crop&q=80',
    })
  }
}

/**
 * POST /api/projects/admin - Create new project
 */
export const createProject = async (req, res, next) => {
  try {
    const { title, description, link, liveLink, repoLink, tags, category, imageUrl, featured } = req.body

    if (!title || !description || (!link && !liveLink)) {
      return res.status(400).json({
        success: false,
        message: 'Project title, description, and link are required.',
      })
    }

    const finalLink = link || liveLink
    let finalImageUrl = imageUrl

    if (!finalImageUrl) {
      finalImageUrl = await extractPreviewImage(finalLink)
    }

    const newProject = {
      id: Date.now(),
      _id: `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      link: finalLink.trim(),
      liveLink: finalLink.trim(),
      repoLink: repoLink ? repoLink.trim() : '',
      imageUrl: finalImageUrl,
      tags: Array.isArray(tags) ? tags : [],
      category: category ? category.trim() : 'Web App',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    }

    const projects = readProjects()
    projects.unshift(newProject)
    writeProjects(projects)

    res.status(201).json({ success: true, data: newProject, message: 'Project created successfully' })
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /api/projects/admin/:id - Update existing project
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const projects = readProjects()
    const index = projects.findIndex((p) => String(p.id) === String(id) || String(p._id) === String(id))

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const current = projects[index]
    const updatedLink = req.body.link || req.body.liveLink || current.link || current.liveLink
    let updatedImageUrl = req.body.imageUrl || current.imageUrl

    if ((req.body.link || req.body.liveLink) && !req.body.imageUrl && updatedLink !== (current.link || current.liveLink)) {
      updatedImageUrl = await extractPreviewImage(updatedLink)
    }

    const updatedProject = {
      ...current,
      ...req.body,
      link: updatedLink,
      liveLink: updatedLink,
      imageUrl: updatedImageUrl,
      featured: req.body.featured !== undefined ? Boolean(req.body.featured) : current.featured,
      updatedAt: new Date().toISOString(),
    }

    projects[index] = updatedProject
    writeProjects(projects)

    res.json({ success: true, data: updatedProject, message: 'Project updated successfully' })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/projects/admin/:id - Delete project
 */
export const deleteProject = (req, res, next) => {
  try {
    const { id } = req.params
    const projects = readProjects()
    const initialLength = projects.length

    const filtered = projects.filter((p) => String(p.id) !== String(id) && String(p._id) !== String(id))

    if (filtered.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    writeProjects(filtered)
    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    next(error)
  }
}
