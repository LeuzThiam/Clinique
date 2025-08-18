
import React from 'react'
import { Link } from 'react-router-dom'


export default function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-auto border-top">
      <div>
        © {new Date().getFullYear()} <strong>Clinique Santé+</strong> | Tous droits réservés
      </div>
      <div>
        <Link to="/about" className="mx-2 text-decoration-none text-secondary">À propos</Link>
        <span className="mx-1">|</span>
        <a href="mailto:contact@cliniquesanteplus.com" className="mx-2 text-decoration-none text-secondary">contact@cliniquesanteplus.com</a>
      </div>
    </footer>
  )
}
