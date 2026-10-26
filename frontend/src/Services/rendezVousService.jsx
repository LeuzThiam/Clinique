import api from './api'

// Récupérer tous les rendez-vous
export const getRendezVous = () => {
  return api.get('rendezvous/')
}

// Récupérer un rendez-vous par son ID
export const getRendezVousById = (id) => {
  return api.get(`rendezvous/${id}/`)
}

// Ajouter un rendez-vous
export const addRendezVous = (data) => {
  return api.post('rendezvous/', data)
}

// Mettre à jour un rendez-vous
export const updateRendezVous = (id, data) => {
  return api.put(`rendezvous/${id}/`, data)
}

// Supprimer un rendez-vous
export const deleteRendezVous = (id) => {
  return api.delete(`rendezvous/${id}/`)
}
