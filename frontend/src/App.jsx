import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Contexte d’authentification
import { AuthProvider } from './context/AuthContext'

// Composants partagés
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Login from './pages/Auth/login'
import Register from './pages/Auth/register'
import Dashboard from './components/Dashboard'
import Patients from './pages/patients'
import Consultations from './pages/consultations'
import DossierMedical from './pages/DossierMedical'
import Prescriptions from './pages/Prescriptions'
import PrescriptionDetails from './pages/PrescriptionDetails'
import RendezVous from './pages/RendezVous'

import Profil from './pages/Profil'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='profil' element={<Profil/>} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/dossiers" element={<DossierMedical />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/prescription-details" element={<PrescriptionDetails />} />
              <Route path='/rendezvous' element={<RendezVous />} />
              <Route path='/*' element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}
