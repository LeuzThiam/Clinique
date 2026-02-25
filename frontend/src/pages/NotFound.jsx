import React from "react";
import { Link } from "react-router-dom";

// Page 404 affichee si la route n existe pas
export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white rounded-4 shadow-lg p-5 text-center" style={{ maxWidth: 440 }}>
        <h1 className="display-1 fw-bold text-danger mb-2">404</h1>
        <h2 className="mb-3 fw-semibold">Page non trouvée</h2>
        <p className="text-secondary mb-4">
          Oups, la page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
