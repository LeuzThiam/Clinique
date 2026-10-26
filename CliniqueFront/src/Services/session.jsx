import api from './api'


export const addSession = (data) => {
  return api.post('session/sessions/', data)
}


export const getsession = () => {
  return api.get('session/sessions/')
}


export const getSessionById = (id) => {
  return api.get(`session/sessions/${id}/`)
}


export const updateSession = (id, data) => {
  return api.put(`session/sessions/${id}/`, data)
}


export const deleteSession = (id) => {
  return api.delete(`session/sessions/${id}/`)
}


export const logoutSession = () => {
  return api.post('session/logout/')
}
