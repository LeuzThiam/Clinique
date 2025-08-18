import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";

// Page inscription utilisateur medecin ou assistant
export default function Register() {
  const navigate = useNavigate(); // Pour changer de page apres inscription

  // Stocke les valeurs du formulaire dans un objet
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "medecin",        // Role par defaut
    adresse: "",
    numero_telephone: "",
    specialite: "",
  });

  // Message derreur si inscription echoue
  const [errorMessage, setErrorMessage] = useState(null);

  // Met a jour les champs du formulaire quand lutilisateur tape
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envoie le formulaire d inscription
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // On garde specialite seulement si role medecin
    const payload = { ...formData };
    if (payload.role !== "medecin") {
      delete payload.specialite;
    }

    try {
      // Envoie les donnees a lapi pour inscrire lutilisateur
      await api.post("utilisateurs/register/", payload);
      alert("Inscription réussie ! Redirection vers la connexion...");
      navigate("/login"); // Va vers la page connexion
    } catch (error) {
      // Affiche le message derreur si probleme
      const msg =
        error.response?.data?.error ||
        JSON.stringify(error.response?.data, null, 2);
      setErrorMessage("Erreur lors de l'inscription : " + msg);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white rounded-4 shadow-lg w-100" style={{ maxWidth: 530, padding: 36 }}>
        <h2 className="text-success text-center fw-bold mb-2">
          Créer un compte
        </h2>
        <div className="text-center text-secondary mb-4">
          Rejoignez la plateforme Clinique Santé+
        </div>
        {/* Affiche erreur si besoin */}
        {errorMessage && (
          <div className="alert alert-danger text-center py-2 mb-3" style={{ whiteSpace: "pre-line" }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="on">
          {/* Champ identifiant utilisateur */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nom d'utilisateur</label>
            <input
              className="form-control"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder="Identifiant"
            />
          </div>
          {/* Champ email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="adresse@email.com"
            />
          </div>
          {/* Champ mot de passe */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Mot de passe</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Votre mot de passe"
            />
          </div>
          {/* Champ prenom et nom sur la meme ligne */}
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label fw-semibold">Prénom</label>
              <input
                className="form-control"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                autoComplete="given-name"
                placeholder="Prénom"
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label fw-semibold">Nom</label>
              <input
                className="form-control"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                autoComplete="family-name"
                placeholder="Nom"
              />
            </div>
          </div>
          {/* Selection du role utilisateur */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Rôle</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="medecin">Médecin</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>
          {/* Champ adresse postale */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Adresse</label>
            <input
              className="form-control"
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              autoComplete="street-address"
              placeholder="Adresse postale"
            />
          </div>
          {/* Champ numero telephone */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Numéro de téléphone</label>
            <input
              className="form-control"
              type="text"
              name="numero_telephone"
              value={formData.numero_telephone}
              onChange={handleChange}
              required
              autoComplete="tel"
              placeholder="Téléphone"
            />
          </div>
          {/* Champ specialite visible seulement si role medecin */}
          {formData.role === "medecin" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Spécialité</label>
              <input
                className="form-control"
                type="text"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                required
                placeholder="Spécialité"
              />
            </div>
          )}
          {/* Bouton pour envoyer le formulaire */}
          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
          >
            S'inscrire
          </button>
        </form>
        {/* Lien vers la page connexion */}
        <div className="text-center mt-4 text-secondary small">
          Déjà inscrit ?{" "}
          <a href="/login" className="text-success text-decoration-underline">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}
