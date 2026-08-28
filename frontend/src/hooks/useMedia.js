import { useEffect, useState } from 'react'

/**
 * Fetches media from the backend by category.
 *
 * @param {string} category  - e.g. 'hero', 'profile', 'photo', 'svg'
 * @param {string} fallback  - fallback URL while loading or on error
 * @returns {{ url, data, loading, error }}
 */
const useMedia = (category, fallback = '') => {
  const [url, setUrl] = useState(fallback)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!category) {
      setLoading(false)
      return
    }

    const fetchMedia = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/media?category=${encodeURIComponent(category)}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || 'Failed to fetch media.')
        const items = json.data || []
        setData(items)
        if (items.length > 0) setUrl(items[0].url)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [category])

  return { url, data, loading, error }
}

export default useMedia
