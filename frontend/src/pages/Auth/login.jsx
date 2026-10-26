import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../Services/api";
import { useAuth } from "../../context/AuthContext";

// Composant pour la page de connexion
export default function Login() {
  const navigate = useNavigate();           // Pour changer de page apres connexion
  const { login } = useAuth();              // Recupere la fonction login du contexte Auth
  const [formData, setFormData] = useState({ username: "", password: "" }); // Stocke les valeurs du formulaire
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const usernameRef = useRef(null);         

  // Met le curseur sur le champ username au chargement de la page
  useEffect(() => {
    if (usernameRef.current) usernameRef.current.focus();
  }, []);

  // Met a jour les champs du formulaire quand l utilisateur tape
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Efface l erreur si on modifie quelque chose
  };

  // Gere la connexion quand on soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empeche le rechargement de la page
    setLoading(true);
    setError(null);
    try {
      // Appelle l API pour se connecter avec username et password
      const response = await api.post("/utilisateurs/login/", {
        username: formData.username,
        password: formData.password,
      });

      // Utilise le contexte Auth pour enregistrer la connexion
      login(response.data.access, response.data.role);

      // Enregistre l id utilisateur si present
      if (response.data.id) {
        localStorage.setItem("user_id", response.data.id);
      }
      // Enregistre le refresh token
      localStorage.setItem("refresh", response.data.refresh);

      // Enregistre le nom complet pour l afficher ailleurs
      if (response.data.first_name) {
        localStorage.setItem(
          "user_name",
          `${response.data.first_name} ${response.data.last_name || ""}`.trim()
        );
      } else if (response.data.username) {
        localStorage.setItem("user_name", response.data.username);
      } else {
        localStorage.setItem("user_name", "Utilisateur");
      }

      
      navigate("/dashboard");
    } catch (err) {
      
      let message = "Nom d utilisateur ou mot de passe incorrect";
      if (err.response && err.response.data && typeof err.response.data === "object") {
        message = err.response.data.detail || message;
      }
      setError(message);
    } finally {
      setLoading(false); 
    }
  };

  // Affichage du formulaire et des messages
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white rounded-4 shadow-lg w-100" style={{ maxWidth: 430, padding: 36 }}>
        <h2 className="text-primary text-center fw-bold mb-2">Connexion a votre espace</h2>
        <div className="text-center text-secondary mb-4">
          Bienvenue sur la plateforme Clinique Sante+
        </div>
        {/* Affiche l erreur si besoin */}
        {error && (
          <div
            className="alert alert-danger text-center py-2 mb-3"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {/* Formulaire de connexion */}
        <form autoComplete="on" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="login-username" className="form-label fw-semibold">
              Nom d utilisateur
            </label>
            <input
              className="form-control"
              id="login-username"
              name="username"
              type="text"
              ref={usernameRef} // Reference pour le focus auto
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
              disabled={loading}
              placeholder="Votre nom d utilisateur"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="login-password" className="form-label fw-semibold">
              Mot de passe
            </label>
            <input
              className="form-control"
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={loading}
              placeholder="Votre mot de passe"
            />
          </div>
          {/* Bouton pour valider le formulaire */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        {/* Lien vers la page inscription */}
        <div className="text-center mt-3 text-secondary small">
          Nouveau sur la plateforme ?{" "}
          <Link to="/register" className="text-primary text-decoration-underline">
            Creer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
