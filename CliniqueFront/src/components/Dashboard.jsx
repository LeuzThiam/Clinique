import React, { useState, useEffect } from "react";
import { User, Calendar, FileText, TrendingUp } from "lucide-react";
import { getPatients } from "../Services/patientService";
import { getRendezVous } from "../Services/rendezVousService";
import { getConsultations } from "../Services/consultationService";
import { getProfil } from "../Services/utilisateurService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/components/Dashboard.css";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [rendezVous, setRendezVous] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPatients(),
      getRendezVous(),
      getConsultations(),
      getProfil().catch(() => ({ data: null })),
    ])
      .then(([patRes, rdvRes, consRes, profilRes]) => {
        setPatients(patRes?.data?.results || patRes?.data || []);
        setRendezVous(rdvRes?.data?.results || rdvRes?.data || []);
        setConsultations(consRes?.data?.results || consRes?.data || []);
        setProfil(profilRes?.data || null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Statistiques dynamiques
  const totalPatients = patients.length;
  const rdvToday = rendezVous.filter(r => (r.date_heure || "").slice(0, 10) === today);
  const totalRdvToday = rdvToday.length;
  const consultationsCeMois = consultations.filter(c =>
    (c.date || "").slice(0, 7) === today.slice(0, 7)
  ).length;
  const totalConsultations = consultations.length;
  const statsRdv = rendezVous.reduce((acc, rdv) => {
    const s = rdv.statut || "EN_ATTENTE";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const tauxSatisfaction = totalPatients > 0
  ? Math.round((totalConsultations / totalPatients) * 100)
  : 100;


  // Gestion dynamique du titre d'accueil selon le rôle
  let titreAccueil = "Bonjour";
  if (profil) {
    const nomComplet =
      ((profil.first_name || "") + " " + (profil.last_name || "")).trim()
      || profil.username || profil.email || "";
    if (profil.role === "medecin") {
      titreAccueil = `Bonjour, Dr. ${nomComplet}`;
    } else if (profil.role === "assistant") {
      titreAccueil = `Bonjour, Assistant ${nomComplet}`;
    } else {
      titreAccueil = `Bonjour, ${nomComplet}`;
    }
  }

  // Carte statistique en Bootstrap
  function CardStat({ icon, label, value, color }) {
    return (
      <div className={`bg-white rounded-4 shadow d-flex flex-column align-items-center p-4 h-100 card-stat-boostrap`}>
        <div className="mb-2" style={{ color, fontSize: "2rem" }}>{icon}</div>
        <div className="fw-bold fs-4">{value}</div>
        <div className="text-secondary">{label}</div>
      </div>
    );
  }

  return (
    <div className="container py-4 min-vh-100 bg-light dashboard-bootstrap">
      {/* Header */}
      <div className="bg-primary bg-gradient text-white rounded-4 p-4 mb-5 shadow">
        <div className="fs-3 fw-bold mb-1">
          {titreAccueil}
        </div>
        <div className="fs-5 opacity-75">
          {loading
            ? "Chargement des rendez-vous…"
            : `Vous avez ${totalRdvToday} rendez-vous aujourd'hui`}
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-3">
          <CardStat icon={<User size={32} />} label="Total Patients" value={totalPatients} color="#4361ee" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <CardStat icon={<Calendar size={32} />} label="Rendez-vous Aujourd'hui" value={totalRdvToday} color="#1dd1a1" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <CardStat icon={<FileText size={32} />} label="Consultations ce Mois" value={consultationsCeMois} color="#54a0ff" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <CardStat icon={<TrendingUp size={32} />} label="Taux de Satisfaction" value={`${tauxSatisfaction}%`} color="#ffd600" />
        </div>
      </div>

      {/* Rendez-vous et Statut */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6">
          <div className="bg-white rounded-4 shadow p-4 d-flex flex-column align-items-center">
            <Calendar size={38} className="text-secondary mb-3" />
            <div className="text-secondary mb-2">
              {loading
                ? "Chargement…"
                : totalRdvToday === 0
                  ? "Aucun rendez-vous aujourd'hui"
                  : `${totalRdvToday} rendez-vous aujourd'hui`}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="bg-white rounded-4 shadow p-4">
            <div className="mb-3 fw-semibold">Statut des Rendez-vous</div>
            <ul className="list-unstyled">
              <li className="mb-1">
                <span className="badge rounded-pill bg-success me-2 status-dot">&nbsp;</span>
                Confirmés : {statsRdv.CONFIRME || 0}
              </li>
              <li className="mb-1">
                <span className="badge rounded-pill bg-info me-2 status-dot">&nbsp;</span>
                Terminés : {statsRdv.TERMINE || 0}
              </li>
              <li>
                <span className="badge rounded-pill bg-warning me-2 status-dot">&nbsp;</span>
                En Attente : {statsRdv.EN_ATTENTE || 0}
              </li>
              <li>
                <span className="badge rounded-pill bg-danger me-2 status-dot">&nbsp;</span>
                Annulés : {statsRdv.ANNULE || 0}
              </li>
              <li>
                <span className="badge rounded-pill bg-secondary me-2 status-dot">&nbsp;</span>
                Refuses : {statsRdv.REFUSE || 0}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Consultations récentes */}
      <div className="bg-white rounded-4 shadow p-4 mb-4">
        <div className="mb-3 fw-semibold">Consultations Récentes</div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Motif</th>
                <th>Diagnostic</th>
              </tr>
            </thead>
            <tbody>
              {consultations
                .slice(-5)
                .reverse()
                .map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.dossier_medical?.patient?.nom} {c.dossier_medical?.patient?.prenom}
                    </td>
                    <td>{c.date?.replace("T", " ").slice(0, 16)}</td>
                    <td>{c.motif}</td>
                    <td>
                      <span className="badge bg-success">
                        {c.diagnostic}
                      </span>
                    </td>
                  </tr>
                ))}
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-secondary">
                    Aucune consultation récente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
