import React, { useState, useEffect } from "react";
import { CalendarDays, User, Stethoscope, Edit, Trash2, Plus, Eye } from "lucide-react";
import {
  getRendezVous,
  addRendezVous,
  updateRendezVous,
  deleteRendezVous,
} from "../Services/rendezVousService";
import { getPatients } from "../Services/patientService";
import { getMedecins } from "../Services/utilisateurService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/RendezVous.css";
import Modal from "./Modal";

export default function RendezVous() {
  const [rendezVous, setRendezVous] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [mode, setMode] = useState("liste"); // liste, ajouter, modifier, consulter
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    patient: "",
    medecin: "",
    date_heure: "",
    motif: "",
    statut: "EN_ATTENTE",
    commentaires: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  function findPatient(pat) {
    if (!pat) return null;
    if (typeof pat === "object") return pat;
    return patients.find(p => p.id === Number(pat));
  }
  function findMedecin(med) {
    if (!med) return null;
    if (typeof med === "object") return med;
    return medecins.find(m => m.id === Number(med));
  }
  const nomCompletPatient = (p) => p ? `${p.nom ?? ""} ${p.prenom ?? ""}`.trim() : "Patient inconnu";
  const nomCompletMedecin = (m) =>
    [m?.first_name || m?.prenom || "", m?.last_name || m?.nom || ""].join(" ").trim() || m?.username || "Médecin inconnu";

  const badgeStatut = (statut) => {
    const map = {
      EN_ATTENTE: "bg-warning text-dark",
      CONFIRME: "bg-success text-white",
      REFUSE: "bg-danger text-white",
      ANNULE: "bg-secondary text-white",
      TERMINE: "bg-primary text-white",
    };
    const lib = {
      EN_ATTENTE: "En attente",
      CONFIRME: "Confirmé",
      REFUSE: "Refusé",
      ANNULE: "Annulé",
      TERMINE: "Terminé",
    };
    return (
      <span className={`badge rounded-pill ${map[statut] || "bg-secondary text-white"} px-3 py-2`}>
        {lib[statut] || statut}
      </span>
    );
  };

  const refreshData = () => {
    getRendezVous().then(res => setRendezVous(res.data)).catch(console.error);
    getPatients().then(res => setPatients(res.data)).catch(console.error);
    getMedecins().then(res => setMedecins(res.data)).catch(console.error);
  };
  useEffect(() => { refreshData(); }, []);

  const handleNouveau = () => {
    setForm({
      patient: "",
      medecin: "",
      date_heure: "",
      motif: "",
      statut: "EN_ATTENTE",
      commentaires: "",
    });
    setSelected(null);
    setMode("ajouter");
  };

  const handleEditer = (rdv) => {
    setSelected(rdv);
    setForm({
      patient: rdv.patient?.id || rdv.patient || "",
      medecin: rdv.medecin?.id || rdv.medecin || "",
      date_heure: rdv.date_heure?.slice(0, 16) || "",
      motif: rdv.motif || "",
      statut: rdv.statut || "EN_ATTENTE",
      commentaires: rdv.commentaires || "",
    });
    setMode("modifier");
  };

  const handleConsulter = (rdv) => {
    setSelected(rdv);
    setMode("consulter");
  };

  const handleDemanderSuppression = (rdv) => {
    setToDelete(rdv);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (toDelete) {
      setLoading(true);
      try {
        await deleteRendezVous(toDelete.id);
        setShowDeleteModal(false);
        setToDelete(null);
        setMode("liste");
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
    const dataToSend = {
      ...form,
      patient: form.patient ? Number(form.patient) : null,
      medecin: form.medecin ? Number(form.medecin) : null,
    };
    try {
      if (mode === "modifier" && selected) await updateRendezVous(selected.id, dataToSend);
      else await addRendezVous(dataToSend);
      setMode("liste");
      setSelected(null);
      refreshData();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
      console.error(err);
    }
    setLoading(false);
  };

  const fields = [
    {
      name: "patient",
      label: "Patient",
      render: (
        <select
          name="patient"
          value={form.patient}
          onChange={e => setForm({ ...form, patient: e.target.value })}
          required
          className="form-select"
        >
          <option value="">-- Sélectionner --</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{nomCompletPatient(p)}</option>
          ))}
        </select>
      ),
    },
    {
      name: "medecin",
      label: "Médecin",
      render: (
        <select
          name="medecin"
          value={form.medecin}
          onChange={e => setForm({ ...form, medecin: e.target.value })}
          required
          className="form-select"
        >
          <option value="">-- Sélectionner --</option>
          {medecins.map(m => (
            <option key={m.id} value={m.id}>{nomCompletMedecin(m)}</option>
          ))}
        </select>
      ),
    },
    {
      name: "date_heure",
      label: "Date et heure",
      render: (
        <input
          type="datetime-local"
          name="date_heure"
          value={form.date_heure}
          onChange={e => setForm({ ...form, date_heure: e.target.value })}
          required
          className="form-control"
        />
      ),
    },
    {
      name: "motif",
      label: "Motif",
      render: (
        <input
          type="text"
          name="motif"
          value={form.motif}
          onChange={e => setForm({ ...form, motif: e.target.value })}
          required
          className="form-control"
        />
      ),
    },
    {
      name: "statut",
      label: "Statut",
      render: (
        <select
          name="statut"
          value={form.statut}
          onChange={e => setForm({ ...form, statut: e.target.value })}
          className="form-select"
        >
          <option value="EN_ATTENTE">En attente</option>
          <option value="CONFIRME">Confirmé</option>
          <option value="REFUSE">Refusé</option>
          <option value="ANNULE">Annulé</option>
          <option value="TERMINE">Terminé</option>
        </select>
      ),
    },
    {
      name: "commentaires",
      label: "Commentaires",
      render: (
        <textarea
          name="commentaires"
          value={form.commentaires}
          onChange={e => setForm({ ...form, commentaires: e.target.value })}
          className="form-control"
        />
      ),
    },
  ];

  return (
    <div className="container py-4 min-vh-100 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-3 fw-bold mb-0">Gestion des Rendez-vous</h1>
          <div className="text-muted">Planifiez, éditez, consultez et supprimez vos rendez-vous</div>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleNouveau}>
          <Plus size={18} /> Nouveau Rendez-vous
        </button>
      </div>

      <div className="row g-4">
        {rendezVous.map(rdv => (
          <div key={rdv.id} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <CalendarDays className="text-primary me-2" size={20} />
                  <span className="fw-semibold">{rdv.date_heure?.replace('T', ' ').slice(0, 16)}</span>
                  <span className="ms-auto">{badgeStatut(rdv.statut)}</span>
                </div>
                <div className="mb-1 text-secondary small d-flex align-items-center gap-1">
                  <User size={16} /> Patient: {nomCompletPatient(findPatient(rdv.patient))}
                </div>
                <div className="mb-1 text-secondary small d-flex align-items-center gap-1">
                  <Stethoscope size={16} /> Médecin: {nomCompletMedecin(findMedecin(rdv.medecin))}
                </div>
                <div className="mb-1 text-secondary small">
                  <b>Motif :</b> {rdv.motif}
                </div>
                {rdv.commentaires && (
                  <div className="mb-1 text-muted small">
                    <b>Commentaires :</b> {rdv.commentaires}
                  </div>
                )}
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-light btn-sm" onClick={() => handleConsulter(rdv)} title="Voir">
                    <Eye size={18} className="text-secondary" />
                  </button>
                  <button className="btn btn-light btn-sm" onClick={() => handleEditer(rdv)} title="Modifier">
                    <Edit size={18} className="text-secondary" />
                  </button>
                  <button className="btn btn-light btn-sm" onClick={() => handleDemanderSuppression(rdv)} title="Supprimer">
                    <Trash2 size={18} className="text-danger" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {rendezVous.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Aucun rendez-vous trouvé.
            </div>
          </div>
        )}
      </div>

      {/* Modal consulter */}
      {mode === "consulter" && selected && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">Détails du Rendez-vous</h4>
          <ul className="mb-4 list-unstyled small">
            <li><b>Date et heure :</b> {selected.date_heure?.replace('T', ' ').slice(0, 16)}</li>
            <li><b>Patient :</b> {nomCompletPatient(findPatient(selected.patient))}</li>
            <li><b>Médecin :</b> {nomCompletMedecin(findMedecin(selected.medecin))}</li>
            <li><b>Motif :</b> {selected.motif}</li>
            <li><b>Statut :</b> {badgeStatut(selected.statut)}</li>
            {selected.commentaires && (
              <li><b>Commentaires :</b> {selected.commentaires}</li>
            )}
          </ul>
          <button onClick={() => setMode("liste")} className="btn btn-primary">
            Fermer
          </button>
        </Modal>
      )}

      {/* Modal ajouter/modifier */}
      {(mode === "ajouter" || mode === "modifier") && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">
            {mode === "ajouter" ? "Nouveau Rendez-vous" : "Modifier Rendez-vous"}
          </h4>
          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label, render }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                {render}
              </div>
            ))}
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
          <p>Voulez-vous vraiment supprimer ce rendez-vous ? Cette action est irréversible.</p>
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
