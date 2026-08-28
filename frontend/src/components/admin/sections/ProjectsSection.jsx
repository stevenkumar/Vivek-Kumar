import React, { useState } from 'react'
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
  Layers,
  Save,
  Check,
} from 'lucide-react'
import AdminCard from '../ui/AdminCard'
import AdminModal from '../ui/AdminModal'
import ConfirmDialog from '../ui/ConfirmDialog'

export const ProjectsSection = ({ projects = [], loading = false, onReload, onToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [fetchingPreview, setFetchingPreview] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Web App',
    tags: '',
    imageUrl: '',
    featured: false,
  })

  const handleOpenAdd = () => {
    setEditingProject(null)
    setForm({
      title: '',
      description: '',
      link: '',
      category: 'Web App',
      tags: '',
      imageUrl: '',
      featured: false,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p) => {
    setEditingProject(p)
    setForm({
      title: p.title || '',
      description: p.description || '',
      link: p.link || p.liveLink || '',
      category: p.category || 'Web App',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      imageUrl: p.imageUrl || '',
      featured: Boolean(p.featured),
    })
    setIsModalOpen(true)
  }

  const handleAutoFetchPreview = async () => {
    if (!form.link.trim()) {
      onToast('Please enter a project link first', 'error')
      return
    }
    setFetchingPreview(true)
    try {
      const res = await fetch('/api/projects/admin/fetch-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.link }),
      })
      const json = await res.json()
      if (json.imageUrl) {
        setForm((prev) => ({ ...prev, imageUrl: json.imageUrl }))
        onToast('Preview image extracted successfully!', 'success')
      }
    } catch {
      onToast('Could not extract preview image automatically', 'error')
    } finally {
      setFetchingPreview(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setActionLoading(true)

    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
    }

    try {
      const url = editingProject
        ? `/api/projects/admin/${editingProject._id || editingProject.id}`
        : '/api/projects/admin'
      const method = editingProject ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to save project')

      onToast(editingProject ? 'Project updated successfully!' : 'Project published successfully!', 'success')
      setIsModalOpen(false)
      if (onReload) onReload()
    } catch (err) {
      onToast(err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/projects/admin/${deleteTarget._id || deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete project')
      onToast('Project deleted successfully', 'success')
      setDeleteTarget(null)
      if (onReload) onReload()
    } catch (err) {
      onToast(err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <AdminCard
        title="Project Management"
        subtitle={`Manage portfolio projects, live demos, and showcase cards (${projects.length} total)`}
        icon={FolderKanban}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReload}
              className="p-2.5 rounded-xl bg-theme-canvas hover:bg-zinc-800 text-theme-muted hover:text-white transition border border-theme cursor-pointer"
              title="Refresh projects list"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg transition cursor-pointer hover:opacity-95"
            >
              <Plus size={15} />
              <span>Add New Project</span>
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-16 text-theme-muted flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin text-theme-primary" />
            <span>Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-theme-canvas rounded-2xl border border-theme p-8 space-y-4">
            <Layers size={40} className="mx-auto text-zinc-600" />
            <h4 className="font-bold text-theme-base text-base">No Projects Found</h4>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              Get started by adding your first showcase project.
            </p>
            <button
              onClick={handleOpenAdd}
              className="gradient-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              Add Project
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {projects.map((p) => (
              <div
                key={p._id || p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-theme-canvas border border-theme hover:border-theme-primary transition-all gap-4 group"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-20 h-14 rounded-xl object-cover bg-theme-card border border-theme shrink-0"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-theme-card border border-theme flex items-center justify-center text-zinc-600 shrink-0">
                      <Layers size={18} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-theme-card text-theme-primary border border-theme font-bold">
                        {p.category || 'Web App'}
                      </span>
                      {p.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          FEATURED
                        </span>
                      )}
                      <h4 className="font-bold text-theme-base text-base truncate">{p.title}</h4>
                    </div>

                    <p className="text-xs text-theme-muted line-clamp-1">{p.description}</p>

                    {(p.link || p.liveLink) && (
                      <a
                        href={p.link || p.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-theme-primary hover:underline truncate inline-flex items-center gap-1 mt-1"
                      >
                        <span className="truncate">{p.link || p.liveLink}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2.5 rounded-xl bg-theme-card hover:bg-zinc-800 text-theme-muted hover:text-white transition border border-theme cursor-pointer"
                    title="Edit project"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Add / Edit Project Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Showcase Project'}
        subtitle="Manage live URL, tags, category, and automatic preview scraping"
        icon={FolderKanban}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Modern Portfolio & Social Terminal"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
              Project URL / Live Link *
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="url"
                required
                placeholder="https://my-app.vercel.app or https://github.com/..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="flex-1 bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all font-mono"
              />
              <button
                type="button"
                onClick={handleAutoFetchPreview}
                disabled={fetchingPreview}
                className="inline-flex items-center justify-center gap-1.5 bg-theme-canvas hover:bg-zinc-800 text-theme-primary border border-theme px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 shrink-0"
              >
                {fetchingPreview ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                <span>{fetchingPreview ? 'Scraping...' : '⚡ Auto-Fetch'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
              Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Brief summary of features, design goals, and engineering stack..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl p-4 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
              >
                <option value="Frontend">Frontend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Web App">Web App</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Vite"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
              Thumbnail Image URL (Auto or Custom)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/... or auto-fetched URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-xs font-mono text-theme-base focus:outline-none focus:border-theme-primary transition-all"
            />
          </div>

          {form.imageUrl && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-theme-canvas border border-theme">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-20 h-12 object-cover rounded-lg border border-theme shrink-0"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <div className="text-xs text-theme-muted truncate">
                <p className="font-bold text-theme-base">Thumbnail Preview</p>
                <p className="truncate font-mono">{form.imageUrl}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-theme-canvas border border-theme rounded-xl">
            <input
              type="checkbox"
              id="featuredToggle"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
            />
            <label htmlFor="featuredToggle" className="text-xs font-bold text-theme-base cursor-pointer">
              Mark as Featured Project (Highlighted on Home)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-theme-canvas border border-theme text-xs font-bold text-theme-muted hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg cursor-pointer disabled:opacity-60 transition hover:opacity-95"
            >
              {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{editingProject ? 'Update Project' : 'Publish Project'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete Project"
        loading={actionLoading}
      />
    </div>
  )
}

export default ProjectsSection
