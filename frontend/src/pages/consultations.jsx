import React, { useState, useEffect } from "react";
import { CalendarDays, User, Edit, Eye, Plus, ClipboardList, Heart, Trash } from "lucide-react";
import api from "../Services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Consultations.css";
import Modal from "./Modal";

export default function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [rendezVous, setRendezVous] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [mode, setMode] = useState("liste");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    date: "",
    motif: "",
    observations: "",
    diagnostic: "",
    dossier_medical_id: "",
    rendez_vous: "",
    medecin: ""
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Récupère l'id du médecin connecté
  const medecinId = localStorage.getItem("user_id");

  // Chargement des données
  const refreshData = () => {
    api.get('consultations/').then(res => Array.isArray(res.data) ? setConsultations(res.data) : setConsultations([]));
    api.get('dossiers-medicaux/').then(res => Array.isArray(res.data) ? setDossiers(res.data) : setDossiers([]));
    api.get('rendezvous/').then(res => Array.isArray(res.data) ? setRendezVous(res.data) : setRendezVous([]));
    api.get('utilisateurs/medecins/').then(res => Array.isArray(res.data) ? setMedecins(res.data) : setMedecins([]));
    api.get('patients/').then(res => Array.isArray(res.data) ? setPatients(res.data) : setPatients([]));
  };
  useEffect(refreshData, []);

  // Helpers pour affichage
  function getPatient(obj) {
    if (!obj) return null;
    if (typeof obj === "object") return obj;
    return patients.find(p => p.id === Number(obj));
  }
  function getMedecin(obj) {
    if (!obj) return null;
    if (typeof obj === "object") return obj;
    return medecins.find(m => m.id === Number(obj));
  }
  function afficheRdv(rdv) {
    const patient = getPatient(rdv.patient);
    const medecin = getMedecin(rdv.medecin);
    const patientNom = patient ? `${patient.nom || ""} ${patient.prenom || ""}`.trim() : "Patient inconnu";
    const medecinNom = medecin
      ? `${medecin.first_name || ""} ${medecin.last_name || ""}`.trim()
      : "Médecin inconnu";
    const dateTxt = rdv.date_heure?.replace('T', ' ').slice(0, 16);
    return `RDV #${rdv.id} - ${patientNom} avec ${medecinNom} le ${dateTxt}`;
  }

  // Modaux
  const handleVoir = (c) => { setSelected(c); setMode("consulter"); };
  const handleEditer = (c) => {
    setSelected(c);
    setForm({
      date: c.date ? c.date.slice(0, 16) : "",
      motif: c.motif || "",
      observations: c.observations || "",
      diagnostic: c.diagnostic || "",
      dossier_medical_id: c.dossier_medical?.patient?.id || c.dossier_medical?.id || c.dossier_medical_id || "",
      rendez_vous: c.rendez_vous?.id || c.rendez_vous || "",
      medecin: c.medecin?.id || c.medecin || ""
    });
    setMode("modifier");
  };
  const handleNouveau = () => {
    setForm({
      date: "",
      motif: "",
      observations: "",
      diagnostic: "",
      dossier_medical_id: "",
      rendez_vous: "",
      medecin: medecinId || ""
    });
    setSelected(null);
    setMode("ajouter");
  };

  // Ouvre le modal de confirmation suppression
  const handleDelete = (c) => {
    setToDelete(c);
    setShowDeleteModal(true);
  };

  // Confirme la suppression
  const confirmDelete = async () => {
    if (toDelete && toDelete.id) {
      setLoading(true);
      try {
        await api.delete(`consultations/${toDelete.id}/`);
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

  // Enregistrement (ajout ou modif)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Vérification du dossier médical obligatoire
    if (!form.dossier_medical_id || isNaN(Number(form.dossier_medical_id))) {
      alert("Veuillez sélectionner un dossier médical valide.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const dataToSend = {
      date: form.date,
      motif: form.motif,
      observations: form.observations,
      diagnostic: form.diagnostic,
      dossier_medical_id: Number(form.dossier_medical_id),
      rendez_vous: form.rendez_vous ? Number(form.rendez_vous) : null,
      medecin_id: medecinId ? Number(medecinId) : null,
    };
    const url = selected ? `consultations/${selected.id}/` : `consultations/`;
    const method = selected ? api.put : api.post;
    try {
      await method(url, dataToSend);
      setMode("liste");
      setSelected(null);
      refreshData();
    } catch (err) {
      alert("Erreur d'enregistrement\n" + (err.response?.data && JSON.stringify(err.response.data, null, 2)));
    }
    setLoading(false);
  };

  // Filtrage des consultations du médecin connecté
  const consultationsFiltrees = consultations.filter(c => {
    if (!c.medecin) return false;
    let medecinIdConsult;
    if (typeof c.medecin === "object" && c.medecin !== null) {
      medecinIdConsult = c.medecin.id;
    } else {
      medecinIdConsult = c.medecin;
    }
    return String(medecinIdConsult) === String(medecinId);
  });

  // Champs du formulaire consultation
  const fields = [
    { name: "date", label: "Date et heure", type: "datetime-local" },
    { name: "motif", label: "Motif" },
    { name: "observations", label: "Observations", type: "textarea" },
    { name: "diagnostic", label: "Diagnostic" },
    { name: "dossier_medical_id", label: "Dossier médical", type: "select-dossier" },
    { name: "rendez_vous", label: "Rendez-vous (optionnel)", type: "select-rdv" },
  ];

  // Affichage principal
  return (
    <div className="container py-4 min-vh-100 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-3 fw-bold d-flex align-items-center gap-2">
            <ClipboardList size={28} /> Gestion des Consultations
          </h1>
          <div className="text-muted">Suivi et enregistrement des consultations médicales</div>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleNouveau}>
          <Plus size={18} /> Nouvelle Consultation
        </button>
      </div>

      {/* Liste des consultations filtrées */}
      <div className="row g-4">
        {consultationsFiltrees.map(c => (
          <div key={c.id} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border h-100 consultation-card">
              <div className="card-body d-flex flex-column gap-2">
                <div className="d-flex align-items-center mb-2">
                  <CalendarDays size={20} className="text-primary me-2" />
                  <span className="fw-semibold">{c.date?.replace("T", " ").slice(0, 16)}</span>
                  <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-link p-0" onClick={() => handleVoir(c)} title="Voir">
                      <Eye size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-link p-0" onClick={() => handleEditer(c)} title="Modifier">
                      <Edit size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-link p-0" onClick={() => handleDelete(c)} title="Supprimer">
                      <Trash size={18} className="text-danger" />
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center text-secondary small gap-2">
                  <User size={16} /> Patient : {c.dossier_medical?.patient?.nom} {c.dossier_medical?.patient?.prenom}
                </div>
                <div className="d-flex align-items-center text-secondary small gap-2">
                  <Heart size={16} /> Motif : {c.motif}
                </div>
                <div className="small text-muted">
                  <b>Diagnostic :</b> {c.diagnostic}
                </div>
              </div>
            </div>
          </div>
        ))}
        {consultationsFiltrees.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Aucune consultation enregistrée.
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {(mode === "ajouter" || mode === "modifier") && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">{mode === "ajouter" ? "Nouvelle Consultation" : "Modifier Consultation"}</h4>
          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label, type }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                {type === "datetime-local" ? (
                  <input
                    className="form-control"
                    type="datetime-local"
                    name={name}
                    value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    required
                  />
                ) : type === "textarea" ? (
                  <textarea
                    className="form-control"
                    name={name}
                    value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                  />
                ) : type === "select-dossier" ? (
                  <select
                    className="form-select"
                    name={name}
                    value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {dossiers.map(d => (
                      <option key={d.patient?.id || d.id} value={d.patient?.id || d.id}>
                        {d.patient?.nom} {d.patient?.prenom}
                      </option>
                    ))}
                  </select>
                ) : type === "select-rdv" ? (
                  <select
                    className="form-select"
                    name={name}
                    value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                  >
                    <option value="">-- Aucun --</option>
                    {rendezVous.map(rdv => (
                      <option key={rdv.id} value={rdv.id}>
                        {afficheRdv(rdv)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="form-control"
                    type="text"
                    name={name}
                    value={form[name] || ""}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    required={name !== "rendez_vous"}
                  />
                )}
              </div>
            ))}
            {/* Champ Médecin masqué (rempli automatiquement) */}
            <input type="hidden" name="medecin" value={medecinId || ""} />
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Enregistrement..." : (mode === "ajouter" ? "Ajouter" : "Modifier")}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setMode("liste")}>
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {mode === "consulter" && selected && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">
            Consultation du {selected.date?.replace("T", " ").slice(0, 16)}
          </h4>
          <ul className="mb-4 list-unstyled small">
            <li><b>Motif :</b> {selected.motif}</li>
            <li><b>Observations :</b> {selected.observations}</li>
            <li><b>Diagnostic :</b> {selected.diagnostic}</li>
            <li><b>Patient :</b> {selected.dossier_medical?.patient?.nom} {selected.dossier_medical?.patient?.prenom}</li>
            <li><b>Médecin :</b> {(selected.medecin?.first_name || selected.medecin?.prenom || '') + ' ' + (selected.medecin?.last_name || selected.medecin?.nom || '')}</li>
            <li>
              <b>Rendez-vous :</b> {selected.rendez_vous
                ? afficheRdv(selected.rendez_vous)
                : ""}
            </li>
          </ul>
          <div className="d-flex gap-2">
            <button onClick={() => setMode("liste")} className="btn btn-secondary">Fermer</button>
            
          </div>
        </Modal>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h5 className="fw-bold mb-3 text-danger">Confirmer la suppression</h5>
          <p>Voulez-vous vraiment supprimer cette consultation ? Cette action est irréversible.</p>
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
