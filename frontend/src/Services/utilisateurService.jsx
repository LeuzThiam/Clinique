import api from './api'

// ---- MÉDECINS ----
export const getMedecins = () => api.get('utilisateurs/medecins/')
export const getMedecinById = (id) => api.get(`utilisateurs/medecins/${id}/`)
export const addMedecin = (data) => api.post('utilisateurs/medecins/', data)
export const updateMedecin = (id, data) => api.put(`utilisateurs/medecins/${id}/`, data)
export const deleteMedecin = (id) => api.delete(`utilisateurs/medecins/${id}/`)

// ---- ASSISTANTS ----
export const getAssistants = () => api.get('utilisateurs/assistants/')
export const getAssistantById = (id) => api.get(`utilisateurs/assistants/${id}/`)
export const addAssistant = (data) => api.post('utilisateurs/assistants/', data)
export const updateAssistant = (id, data) => api.put(`utilisateurs/assistants/${id}/`, data)
export const deleteAssistant = (id) => api.delete(`utilisateurs/assistants/${id}/`)

// ---- PROFIL UTILISATEUR CONNECTÉ ----
export const getProfil = () => api.get('utilisateurs/me');
