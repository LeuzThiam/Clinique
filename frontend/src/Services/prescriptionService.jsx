import api from './api'

// Toutes les prescriptions
export const getPrescriptions = () => {
  return api.get('prescriptions/')
}

// Prescription par ID
export const getPrescriptionById = (id) => {
  return api.get(`prescriptions/${id}/`)
}

// Ajouter une prescription
export const addPrescription = (data) => {
  return api.post('prescriptions/', data)
}

// Modifier une prescription
export const updatePrescription = (id, data) => {
  return api.put(`prescriptions/${id}/`, data)
}

// Supprimer une prescription
export const deletePrescription = (id) => {
  return api.delete(`prescriptions/${id}/`)
}
