import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <img
        src="/logo_clinique.png"
        alt="Logo Clinique"
        className="mb-4"
        style={{ width: 192, maxWidth: "100%" }}
        onError={e => (e.target.style.display = "none")}
      />
      {/* Titre et slogan */}
      <h1 className="mb-2 text-primary fw-bold text-center" style={{ fontSize: "2.3rem" }}>
        Bienvenue à la Clinique Santé+
      </h1>
      <h5 className="mb-4 text-secondary text-center fw-medium">
        Gestion efficace et sécurisée des dossiers médicaux
      </h5>
      
      {/* Carte de bienvenue */}
      <div className="card shadow border-0 mb-5" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body p-4 d-flex flex-column align-items-center">
          <div className="mb-4 text-center fs-5 text-secondary">
            Accédez à votre espace :
          </div>
          <div className="row w-100 g-3 mb-3">
            <div className="col-6">
              <Link to="/login" className="w-100">
                <button className="btn btn-primary w-100 fs-5 fw-semibold">
                  Connexion
                </button>
              </Link>
            </div>
            <div className="col-6">
              <Link to="/register" className="w-100">
                <button className="btn btn-outline-primary w-100 fs-5 fw-semibold">
                  Inscription
                </button>
              </Link>
            </div>
          </div>
          <div className="text-muted text-center mt-3" style={{ fontSize: 15 }}>
            Pour toute question,{" "}
            <Link to="/contact" className="text-primary text-decoration-underline">
              contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
