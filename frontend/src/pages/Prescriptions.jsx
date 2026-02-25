import React, { useState, useEffect } from "react";
import { ClipboardCheck, Edit, Eye, Plus, ClipboardList, Trash } from "lucide-react";
import api from "../Services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Prescriptions.css";
import Modal from "./Modal";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [mode, setMode] = useState("liste");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    consultation: "",
    etat: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const medecinId = localStorage.getItem("user_id");

  function getConsultation(obj) {
    if (!obj) return null;
    if (typeof obj === "object") return obj;
    return consultations.find(c => c.id === Number(obj));
  }

  function afficheConsultation(consult) {
    consult = getConsultation(consult);
    if (!consult) return "Consultation inconnue";
    const date = consult.date?.slice(0, 16).replace("T", " ") || "";
    const motif = consult.motif || "";
    const patient = consult.dossier_medical?.patient;
    const medecin = consult.medecin;
    const patientNom = patient ? `${patient.nom || ""} ${patient.prenom || ""}`.trim() : "";
    const medecinNom = medecin
      ? `${medecin.first_name || medecin.prenom || ""} ${medecin.last_name || medecin.nom || ""}`.trim()
      : "";
    return `${date} – ${motif} (${patientNom}${medecinNom ? " / " + medecinNom : ""})`;
  }

  const refreshData = () => {
    api.get("prescriptions/").then(res => setPrescriptions(res.data)).catch(console.error);
    api.get("consultations/").then(res => setConsultations(res.data)).catch(console.error);
  };
  useEffect(refreshData, []);

  // Ajout ou édition
  const handleVoir = (p) => { setSelected(p); setMode("consulter"); };
  const handleEditer = (p) => {
    setSelected(p);
    setForm({
      consultation: p.consultation?.id || p.consultation || "",
      etat: p.etat || "",
    });
    setMode("modifier");
  };
  const handleNouveau = () => {
    setForm({ consultation: "", etat: "" });
    setSelected(null);
    setMode("ajouter");
  };

  // Suppression
  const handleDelete = (p) => {
    setToDelete(p);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (toDelete) {
      setLoading(true);
      try {
        await api.delete(`prescriptions/${toDelete.id}/`);
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

  // Clôturer
  const handleCloturer = async (p) => {
    setLoading(true);
    try {
      await api.patch(`prescriptions/${p.id}/`, { etat: "clôturée" });
      setMode("liste");
      refreshData();
    } catch (err) {
      alert("Échec du changement d’état");
    }
    setLoading(false);
  };

  // Enregistrement ajout/modif
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "modifier" && selected) {
        await api.put(`prescriptions/${selected.id}/`, { ...form, consultation: Number(form.consultation) });
      } else {
        await api.post("prescriptions/", { ...form, consultation: Number(form.consultation) });
      }
      setMode("liste");
      setSelected(null);
      refreshData();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
    setLoading(false);
  };

  // FILTRAGE: prescriptions du médecin connecté
  const prescriptionsFiltrees = prescriptions.filter(p => {
    const consult = getConsultation(p.consultation);
    if (!consult || !consult.medecin) return false;
    const consultMedecinId = typeof consult.medecin === "object" && consult.medecin !== null
      ? consult.medecin.id
      : consult.medecin;
    return consultMedecinId == medecinId;
  });

  return (
    <div className="container py-4 min-vh-100 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-3 fw-bold d-flex align-items-center gap-2">
            <ClipboardList size={28} /> Gestion des Prescriptions
          </h1>
          <div className="text-muted">Ordonnez, consultez, modifiez et supprimez les prescriptions</div>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleNouveau}>
          <Plus size={18} /> Nouvelle Prescription
        </button>
      </div>

      <div className="row g-4">
        {prescriptionsFiltrees.map((p) => (
          <div key={p.id} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border h-100 prescription-card">
              <div className="card-body d-flex flex-column gap-2">
                <div className="d-flex align-items-center mb-2">
                  <ClipboardCheck className="text-primary me-2" size={20} />
                  <span className="fw-semibold">
                    {p.date_prescription?.slice(0, 16).replace("T", " ")}
                  </span>
                  <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-link p-0" onClick={() => handleVoir(p)} title="Voir">
                      <Eye size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-link p-0" onClick={() => handleEditer(p)} title="Modifier">
                      <Edit size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-link p-0" onClick={() => handleDelete(p)} title="Supprimer">
                      <Trash size={18} className="text-danger" />
                    </button>
                    {p.etat !== "clôturée" && (
                      <button className="btn btn-link p-0" onClick={() => handleCloturer(p)} title="Clôturer">
                        <ClipboardCheck size={18} className="text-success" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="small">
                  <b>Consultation&nbsp;:</b> {afficheConsultation(p.consultation)}
                </div>
                <div className="text-muted small">
                  <b>État :</b> {p.etat || "active"}
                </div>
              </div>
            </div>
          </div>
        ))}
        {prescriptionsFiltrees.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Aucune prescription enregistrée.
            </div>
          </div>
        )}
      </div>

      {/* Modal ajouter/modifier */}
      {(mode === "ajouter" || mode === "modifier") && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">{mode === "ajouter" ? "Nouvelle Prescription" : "Modifier Prescription"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Consultation associée</label>
              <select
                className="form-select"
                name="consultation"
                value={form.consultation}
                onChange={e => setForm({ ...form, consultation: e.target.value })}
                required
              >
                <option value="">-- Choisir --</option>
                {consultations.map(c => (
                  <option key={c.id} value={c.id}>
                    {afficheConsultation(c)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">État (optionnel)</label>
              <input
                className="form-control"
                name="etat"
                value={form.etat}
                onChange={e => setForm({ ...form, etat: e.target.value })}
              />
            </div>
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

      {/* Modal consulter */}
      {mode === "consulter" && selected && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">Détails de la prescription</h4>
          <ul className="mb-4 list-unstyled small">
            <li>
              <b>Date :</b>{" "}
              {selected.date_prescription
                ? selected.date_prescription.slice(0, 16).replace("T", " ")
                : ""}
            </li>
            <li>
              <b>Consultation :</b> {afficheConsultation(selected.consultation)}
            </li>
            <li>
              <b>État :</b> {selected.etat || "active"}
            </li>
          </ul>
          <div className="d-flex gap-2">
            <button onClick={() => setMode("liste")} className="btn btn-secondary">
              Retour
            </button>
            
          </div>
        </Modal>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h5 className="fw-bold mb-3 text-danger">Confirmer la suppression</h5>
          <p>Voulez-vous vraiment supprimer cette prescription ? Cette action est irréversible.</p>
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
