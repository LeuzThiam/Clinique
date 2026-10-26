import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur de requête : ajoute le token d'authentification si présent
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  // N’ajoute PAS le token pour ces endpoints :
  const publicRoutes = ['register', 'login', 'refresh']
  const isPublic = publicRoutes.some(route => config.url.includes(route))

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Intercepteur de réponse : détecte les erreurs 401 (token expiré/invalide)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Nettoie le localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
      localStorage.removeItem('role')
      // Redirige vers la page de connexion
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
