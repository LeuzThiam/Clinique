import api from './api'

// Tous les détails de prescription
export const getPrescriptionDetails = () => {
  return api.get('prescription-details/')
}

// Détail de prescription par ID
export const getPrescriptionDetailById = (id) => {
  return api.get(`prescription-details/${id}/`)
}

// Ajouter un détail de prescription
export const addPrescriptionDetail = (data) => {
  return api.post('prescription-details/', data)
}

// Modifier un détail de prescription
export const updatePrescriptionDetail = (id, data) => {
  return api.put(`prescription-details/${id}/`, data)
}

// Supprimer un détail de prescription
export const deletePrescriptionDetail = (id) => {
  return api.delete(`prescription-details/${id}/`)
}
