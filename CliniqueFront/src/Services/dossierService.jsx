import api from './api'

// Récupérer tous les dossiers médicaux
export const getDossiers = () => {
  return api.get('dossiers-medicaux/')
}

// Récupérer un dossier par son ID
export const getDossierById = (id) => {
  return api.get(`dossiers-medicaux/${id}/`)
}

// Ajouter un nouveau dossier médical
export const addDossier = (data) => {
  return api.post('dossiers-medicaux/', data)
}

// Mettre à jour un dossier médical
export const updateDossier = (id, data) => {
  return api.put(`dossiers-medicaux/${id}/`, data)
}

// Supprimer un dossier médical
export const deleteDossier = (id) => {
  return api.delete(`dossiers-medicaux/${id}/`)
}
