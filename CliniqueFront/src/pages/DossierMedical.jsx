import React, { useState, useEffect } from "react";
import { FileText, Edit, Eye, Plus, User, Trash } from "lucide-react";
import { getDossiers, addDossier, updateDossier, deleteDossier } from "../Services/dossierService";
import { getPatients } from "../Services/patientService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/DossierMedical.css";
import Modal from "./Modal";

export default function DossierMedical() {
  const [dossiers, setDossiers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [mode, setMode] = useState("liste");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    traitement_passes: "",
    allergies: "",
    notes: "",
    antecedents_familiaux: "",
    date_suivante_visite: "",
    patient_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const refreshData = () => {
    getDossiers().then(res => setDossiers(res.data)).catch(console.error);
    getPatients().then(res => setPatients(res.data)).catch(console.error);
  };

  useEffect(refreshData, []);

  // Pour l'ajout : patients sans dossier
  const patientsSansDossier = patients.filter(
    p => !dossiers.some(d => (d.patient?.id ?? d.patient_id ?? d.patient) === p.id)
  );

  // Handlers modaux
  const handleVoir = (d) => { setSelected(d); setMode("consulter"); };
  const handleEditer = (d) => {
    setSelected(d);
    setForm({
      traitement_passes: d.traitement_passes || "",
      allergies: d.allergies || "",
      notes: d.notes || "",
      antecedents_familiaux: d.antecedents_familiaux || "",
      date_suivante_visite: d.date_suivante_visite?.slice(0, 16) || "",
      patient_id: Number(d.patient?.id ?? d.patient_id ?? d.patient ?? "")
    });
    setMode("modifier");
  };
  const handleNouveau = () => {
    setForm({
      traitement_passes: "",
      allergies: "",
      notes: "",
      antecedents_familiaux: "",
      date_suivante_visite: "",
      patient_id: ""
    });
    setSelected(null);
    setMode("ajouter");
  };

  // Ouvre le modal de suppression
  const handleDelete = (d) => {
    setToDelete(d);
    setShowDeleteModal(true);
  };

  // Confirme suppression
  const confirmDelete = async () => {
    if (toDelete) {
      setLoading(true);
      try {
        await deleteDossier(toDelete.patient?.id ?? toDelete.patient_id ?? toDelete.patient);
        setShowDeleteModal(false);
        setToDelete(null);
        setMode("liste");
        setSelected(null);
        refreshData();
      } catch {
        alert("Erreur lors de la suppression");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "modifier" && selected) {
        await updateDossier(selected.patient?.id ?? selected.patient_id ?? selected.patient, form);
      } else {
        await addDossier(form);
      }
      setMode("liste");
      setSelected(null);
      refreshData();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
    setLoading(false);
  };

  return (
    <div className="container py-4 min-vh-100 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-3 fw-bold d-flex align-items-center gap-2">
            <FileText size={28} /> Gestion des Dossiers Médicaux
          </h1>
          <div className="text-muted">Consultez et éditez les dossiers médicaux des patients</div>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleNouveau}>
          <Plus size={18} /> Nouveau Dossier
        </button>
      </div>

      {/* Liste des dossiers */}
      <div className="row g-4">
        {dossiers.map((d) => (
          <div key={d.patient?.id ?? d.patient_id ?? d.patient} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border h-100 dossier-card">
              <div className="card-body d-flex flex-column gap-2">
                <div className="d-flex align-items-center mb-1">
                  <User size={18} className="text-primary me-2" />
                  <span className="fw-semibold">{d.patient?.prenom} {d.patient?.nom}</span>
                  <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-link p-0" onClick={() => handleVoir(d)} title="Voir">
                      <Eye size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-link p-0" onClick={() => handleEditer(d)} title="Modifier">
                      <Edit size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-link p-0" onClick={() => handleDelete(d)} title="Supprimer">
                      <Trash size={18} className="text-danger" />
                    </button>
                  </div>
                </div>
                <div className="small"><b>Allergies :</b> {d.allergies}</div>
                <div className="text-muted small">
                  <b>Date de création :</b> {d.date_creation ? new Date(d.date_creation).toLocaleDateString() : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
        {dossiers.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Aucun dossier médical enregistré.
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {mode === "consulter" && selected && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">
            Dossier de {selected.patient?.prenom} {selected.patient?.nom}
          </h4>
          <ul className="mb-4 list-unstyled small">
            <li><b>Traitements passés :</b> {selected.traitement_passes}</li>
            <li><b>Allergies :</b> {selected.allergies}</li>
            <li><b>Notes :</b> {selected.notes}</li>
            <li><b>Antécédents familiaux :</b> {selected.antecedents_familiaux}</li>
            <li><b>Prochaine visite :</b> {selected.date_suivante_visite}</li>
            <li><b>Date de création :</b> {selected.date_creation ? new Date(selected.date_creation).toLocaleDateString() : ""}</li>
          </ul>
          <div className="d-flex gap-2">
            <button onClick={() => setMode("liste")} className="btn btn-secondary">Fermer</button>

          </div>
        </Modal>
      )}

      {(mode === "ajouter" || mode === "modifier") && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">
            {mode === "ajouter" ? "Nouveau Dossier Médical" : "Modifier Dossier Médical"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Traitements passés</label>
              <textarea
                className="form-control"
                name="traitement_passes"
                value={form.traitement_passes}
                onChange={e => setForm({ ...form, traitement_passes: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Allergies</label>
              <textarea
                className="form-control"
                name="allergies"
                value={form.allergies}
                onChange={e => setForm({ ...form, allergies: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                name="notes"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Antécédents familiaux</label>
              <textarea
                className="form-control"
                name="antecedents_familiaux"
                value={form.antecedents_familiaux}
                onChange={e => setForm({ ...form, antecedents_familiaux: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date de la prochaine visite</label>
              <input
                className="form-control"
                type="datetime-local"
                name="date_suivante_visite"
                value={form.date_suivante_visite}
                onChange={e => setForm({ ...form, date_suivante_visite: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Patient</label>
              <select
                className="form-select"
                name="patient_id"
                value={form.patient_id ?? ""}
                onChange={e => setForm({ ...form, patient_id: Number(e.target.value) })}
                required
                disabled={mode === "modifier"}
              >
                <option value="">-- Sélectionner --</option>
                {(mode === "ajouter" ? patientsSansDossier : patients).map(p => (
                  <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Enregistrement..." : (mode === "ajouter" ? "Ajouter" : "Modifier")}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMode("liste")}
              >
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h5 className="fw-bold mb-3 text-danger">Confirmer la suppression</h5>
          <p>Voulez-vous vraiment supprimer ce dossier médical ? Cette action est irréversible.</p>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
              Supprimer
            </button>
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
