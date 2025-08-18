import React, { useState, useEffect } from "react";
import api from "../Services/api";
import { useSearchParams } from "react-router-dom";
import { Eye, Edit, Trash } from "lucide-react";
import ModalBootstrap from "./Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/PrescriptionDetails.css";

const getMedecinId = () => localStorage.getItem("user_id");

export default function PrescriptionDetails() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    medicament: "",
    dosage: "",
    instructions: "",
    duree: "",
    prescription_id: ""
  });
  const [selectedId, setSelectedId] = useState(null);
  const [lectureSeule, setLectureSeule] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patient");
  const medecinId = getMedecinId();

  useEffect(() => {
    api.get("prescriptions/").then(res => setPrescriptions(res.data));
    api.get("consultations/").then(res => setConsultations(res.data));
    api.get("prescription-details/").then(res => setDetails(res.data));
  }, [modalVisible]);

  const getConsultationByPrescription = (p) => {
    if (typeof p.consultation === "object") return p.consultation;
    return consultations.find(c => c.id === p.consultation);
  };

  const prescriptionsFiltres = prescriptions.filter(p => {
    const consult = getConsultationByPrescription(p);
    if (!consult) return false;
    const medecin = typeof consult.medecin === "object" ? consult.medecin?.id : consult.medecin;
    if (medecin !== parseInt(medecinId)) return false;

    if (patientId) {
      const patient = consult?.dossier_medical?.patient;
      return String(typeof patient === "object" ? patient?.id : patient) === patientId;
    }

    return true;
  });

  const detailsFiltres = details.filter(d =>
    prescriptionsFiltres.some(p => p.id === d.prescription || p.id === d.prescription_id)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "prescription_id" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await api.put(`prescription-details/${selectedId}/`, formData);
        alert("Détail mis à jour");
      } else {
        await api.post("prescription-details/", formData);
        alert("Détail ajouté");
      }
      reset();
    } catch (err) {
      alert("Erreur d'enregistrement");
    }
  };

  const openModal = (detail = null, viewOnly = false) => {
    if (detail) {
      setFormData({
        medicament: detail.medicament,
        dosage: detail.dosage,
        instructions: detail.instructions,
        duree: detail.duree,
        prescription_id: detail.prescription || detail.prescription_id,
      });
      setSelectedId(viewOnly ? null : detail.id);
      setLectureSeule(viewOnly);
    } else {
      setFormData({
        medicament: "",
        dosage: "",
        instructions: "",
        duree: "",
        prescription_id: ""
      });
      setSelectedId(null);
      setLectureSeule(false);
    }
    setModalVisible(true);
  };

  const handleDelete = async (detail) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await api.delete(`prescription-details/${detail.id}/`);
        alert("Détail supprimé");
        setModalVisible(false);
      } catch (err) {
        alert("Erreur de suppression");
      }
    }
  };

  const reset = () => {
    setModalVisible(false);
    setFormData({
      medicament: "",
      dosage: "",
      instructions: "",
      duree: "",
      prescription_id: ""
    });
    setSelectedId(null);
    setLectureSeule(false);
  };

  const getPrescriptionInfo = (prescriptionId) => {
    const p = prescriptions.find(x => x.id === prescriptionId);
    const c = getConsultationByPrescription(p || {});
    const patient = c?.dossier_medical?.patient;
    const nom = patient?.nom || "";
    const prenom = patient?.prenom || "";
    return `${p?.date_prescription?.slice(0, 16)} | Patient: ${nom} ${prenom} | État: ${p?.etat || "?"}`;
  };

  return (
    <div className="container py-4 min-vh-100 bg-light">
      <h2 className="fs-3 fw-bold text-primary mb-2">Détails de prescriptions</h2>
      <p className="text-muted mb-4">Liste des détails</p>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => openModal()}>+ Ajouter</button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Médicament</th>
              <th>Dosage</th>
              <th>Durée</th>
              <th>Instructions</th>
              <th>Prescription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {detailsFiltres.map((d, i) => (
              <tr key={i}>
                <td>{d.medicament}</td>
                <td>{d.dosage}</td>
                <td>{d.duree} jours</td>
                <td>{d.instructions}</td>
                <td>{getPrescriptionInfo(d.prescription || d.prescription_id)}</td>
                <td>
                  <button className="btn btn-link p-0 me-1 text-primary" onClick={() => openModal(d, true)}><Eye size={18} /></button>
                  <button className="btn btn-link p-0 me-1 text-primary" onClick={() => openModal(d, false)}><Edit size={18} /></button>
                  <button className="btn btn-link p-0 text-danger" onClick={() => handleDelete(d)}><Trash size={18} /></button>
                </td>
              </tr>
            ))}
            {detailsFiltres.length === 0 && (
              <tr><td colSpan="6" className="text-center py-3 text-muted">Aucun détail</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <ModalBootstrap onClose={reset}>
          <h4 className="fw-bold mb-3 text-primary text-center">
            {lectureSeule ? "Voir le détail" : selectedId ? "Modifier le détail" : "Nouveau détail"}
          </h4>
          <form onSubmit={handleSubmit}>
            {["medicament", "dosage", "instructions", "duree"].map((field, i) => (
              <div className="mb-3" key={i}>
                <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === "instructions" ? (
                  <textarea
                    className="form-control"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={lectureSeule}
                  />
                ) : (
                  <input
                    className="form-control"
                    type={field === "duree" ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={lectureSeule}
                    required
                  />
                )}
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Prescription associée</label>
              <select
                className="form-select"
                name="prescription_id"
                value={formData.prescription_id}
                onChange={handleChange}
                required
                disabled={lectureSeule}
              >
                <option value="">-- Choisir --</option>
                {prescriptionsFiltres.map(p => {
                  const c = getConsultationByPrescription(p);
                  const pat = c?.dossier_medical?.patient || {};
                  return (
                    <option key={p.id} value={p.id}>
                      {p.date_prescription?.slice(0, 16)} | {pat.nom} {pat.prenom}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-4">
              {!lectureSeule && (
                <button type="submit" className="btn btn-primary">
                  {selectedId ? "Modifier" : "Ajouter"}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={reset}>
                {lectureSeule ? "Fermer" : "Annuler"}
              </button>
            </div>
          </form>
        </ModalBootstrap>
      )}
    </div>
  );
}
