import api from './api'

// Récupérer toutes les consultations
export const getConsultations = () => {
  return api.get('consultations/')
}

// Récupérer une consultation par son ID
export const getConsultationById = (id) => {
  return api.get(`consultations/${id}/`)
}

// Ajouter une nouvelle consultation
export const addConsultation = (data) => {
  return api.post('consultations/', data)
}

// Mettre à jour une consultation
export const updateConsultation = (id, data) => {
  return api.put(`consultations/${id}/`, data)
}

// Supprimer une consultation
export const deleteConsultation = (id) => {
  return api.delete(`consultations/${id}/`)
}
