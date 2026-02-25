import api from './api'


export const addSession = (data) => {
  return api.post('session/', data)
}


export const getsession = () => {
  return api.get('session/')
}


export const getSessionById = (id) => {
  return api.get(`session/${id}/`)
}


export const updateSession = (id, data) => {
  return api.put(`session/${id}/`, data)
}


export const deleteSession = (id) => {
  return api.delete(`session/${id}/`)
}


export const logoutSession = () => {
  return api.post('session/logout/')
}
