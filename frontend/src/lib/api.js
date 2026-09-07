export const getAdminToken = () => sessionStorage.getItem('admin_token') || ''

export const adminFetch = (url, options = {}) => {
  const headers = new Headers(options.headers || {})
  const token = getAdminToken()

  if (token) headers.set('Authorization', `Bearer ${token}`)

  return fetch(url, {
    ...options,
    headers,
  })
}

