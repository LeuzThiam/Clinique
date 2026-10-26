import React, { useState, useEffect } from "react";
import { Mail, Phone, CalendarDays, Heart, Eye, Edit, Plus, Trash } from "lucide-react";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../Services/patientService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Patients.css";
import Modal from "./Modal";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("liste");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    adresse: "",
    numero_telephone: "",
    adresse_email: "",
    groupe_sanguin: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Charge les patients au chargement du composant
  const refreshPatients = () =>
    getPatients()
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Erreur chargement patients :", err));

  useEffect(() => {
    refreshPatients();
  }, []);

  // Filtrage simple sur nom, prénom, email
  const filtered = patients.filter((p) =>
    [p.nom, p.prenom, p.adresse_email]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(search.toLowerCase()))
  );

  // Initiales pour l’avatar
  const getInitiales = (p) => ((p.nom?.[0] ?? "") + (p.prenom?.[0] ?? "")).toUpperCase();

  // Pour ouvrir la fiche en lecture
  const handleVoir = (p) => {
    setSelected(p);
    setMode("consulter");
  };

  // Pour ouvrir la fiche en édition
  const handleEditer = (p) => {
    setSelected(p);
    setForm({
      nom: p.nom || "",
      prenom: p.prenom || "",
      date_naissance: p.date_naissance || "",
      adresse: p.adresse || "",
      numero_telephone: p.numero_telephone || "",
      adresse_email: p.adresse_email || "",
      groupe_sanguin: p.groupe_sanguin || "",
    });
    setMode("modifier");
  };

  // Pour ouvrir le modal d'ajout
  const handleNouveau = () => {
    setForm({
      nom: "",
      prenom: "",
      date_naissance: "",
      adresse: "",
      numero_telephone: "",
      adresse_email: "",
      groupe_sanguin: "",
    });
    setMode("ajouter");
    setSelected(null);
  };

  // Pour ouvrir la confirmation de suppression
  const handleDelete = (p) => {
    setToDelete(p);
    setShowDeleteModal(true);
  };

  // Pour confirmer et effectuer la suppression
  const confirmDelete = async () => {
    if (toDelete && toDelete.id) {
      setLoading(true);
      try {
        await deletePatient(toDelete.id);
        setShowDeleteModal(false);
        setToDelete(null);
        setMode("liste");
        setSelected(null);
        refreshPatients();
      } catch {
        alert("Erreur lors de la suppression");
      }
      setLoading(false);
    }
  };

  // Gère le formulaire d'ajout ou modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "ajouter") await addPatient(form);
      else if (mode === "modifier" && selected) await updatePatient(selected.id, form);
      setMode("liste");
      setSelected(null);
      refreshPatients();
    } catch {
      alert("Erreur lors de l'enregistrement");
    }
    setLoading(false);
  };

  // Champs du formulaire patient
  const fields = [
    { name: "nom", label: "Nom" },
    { name: "prenom", label: "Prénom" },
    { name: "date_naissance", label: "Date de naissance", type: "date" },
    { name: "adresse", label: "Adresse" },
    { name: "numero_telephone", label: "Numéro de téléphone" },
    { name: "adresse_email", label: "Adresse email", type: "email" },
    { name: "groupe_sanguin", label: "Groupe sanguin" },
  ];

  return (
    <div className="container py-4 min-vh-100 bg-light">
      {/* Header + recherche */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-3 fw-bold mb-0">Gestion des Patients</h1>
          <div className="text-muted">Gérez les informations de vos patients</div>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleNouveau}
        >
          <Plus size={18} /> Nouveau Patient
        </button>
      </div>
      <input
        className="form-control mb-4 shadow-sm"
        type="search"
        placeholder="Rechercher un patient par nom, prénom ou email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Liste */}
      <div className="row g-4">
        {filtered.map((p, i) => (
          <div key={p.id || i} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar-patient me-3">{getInitiales(p)}</div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold fs-5">{p.nom} {p.prenom}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-light" onClick={() => handleVoir(p)} title="Voir">
                      <Eye size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-sm btn-light" onClick={() => handleEditer(p)} title="Éditer">
                      <Edit size={18} className="text-secondary" />
                    </button>
                    <button className="btn btn-sm btn-light" onClick={() => handleDelete(p)} title="Supprimer">
                      <Trash size={18} className="text-danger" />
                    </button>
                  </div>
                </div>
                <div className="mb-1 text-secondary small d-flex align-items-center gap-1">
                  <Mail size={16} /> {p.adresse_email}
                </div>
                <div className="mb-1 text-secondary small d-flex align-items-center gap-1">
                  <Phone size={16} /> {p.numero_telephone}
                </div>
                <div className="mb-1 text-secondary small d-flex align-items-center gap-1">
                  <CalendarDays size={16} /> Né(e) le {p.date_naissance}
                </div>
                <div className="mb-1 text-secondary small d-flex align-items-center gap-1">
                  <Heart size={16} /> Groupe sanguin: {p.groupe_sanguin}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Aucun patient trouvé.
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {mode === "consulter" && selected && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">Fiche Patient</h4>
          <ul className="list-group mb-4">
            {fields.map(({ name, label }) => (
              <li key={name} className="list-group-item d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{label} :</span>
                <span>{selected[name]}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex gap-2">
            <button onClick={() => setMode("liste")} className="btn btn-secondary">Fermer</button>
            
          </div>
        </Modal>
      )}

      {(mode === "ajouter" || mode === "modifier") && (
        <Modal onClose={() => setMode("liste")}>
          <h4 className="fw-bold mb-3">
            {mode === "ajouter" ? "Nouveau Patient" : "Modifier Patient"}
          </h4>
          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label, type }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                <input
                  className="form-control"
                  type={type || "text"}
                  name={name}
                  value={form[name] || ""}
                  onChange={e => setForm({ ...form, [name]: e.target.value })}
                  required={name !== "groupe_sanguin"}
                />
              </div>
            ))}
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

      {/* Modal de confirmation suppression */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h5 className="fw-bold mb-3 text-danger">Confirmer la suppression</h5>
          <p>Voulez-vous vraiment supprimer ce patient ? Cette action est irréversible.</p>
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
