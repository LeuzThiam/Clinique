import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Spinner, Badge } from 'react-bootstrap'
import { getProfil } from '../Services/utilisateurService'
import { useAuth } from '../context/AuthContext'

export default function Profil() {
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noUser, setNoUser] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { role } = useAuth()  // pour l'affichage, optionnel

  useEffect(() => {
    setLoading(true)
    getProfil()
      .then(res => {
        setProfil(res?.data)
        setNoUser(false)
      })
      .catch(err => {
        setProfil(null)
        setNoUser(true)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  if (noUser) {
    return (
      <Container className="py-5">
        <h3 className="text-danger">Aucun utilisateur connecté ou erreur de chargement du profil.</h3>
      </Container>
    )
  }

  if (!profil) {
    return (
      <Container className="py-5">
        <h3 className="text-danger">Profil non trouvé</h3>
      </Container>
    )
  }

  // Affichage des initiales 
  const getInitiales = (profil) => {
    const prenom = (profil?.first_name || profil?.prenom || "")[0] || ""
    const nom = (profil?.last_name || profil?.nom || "")[0] || ""
    return (prenom + nom).toUpperCase() || "U"
  }

  return (
    <Container className="py-4" style={{ maxWidth: 680 }}>
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body>
          <Row>
            <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
              {avatarError ? (
                <div
                  style={{
                    width: 98, height: 98, borderRadius: "50%",
                    background: "#f3f5fb", border: "2px solid #eef3fb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 32, fontWeight: 700, color: "#1270ec"
                  }}
                  className="mb-3"
                >
                  {getInitiales(profil)}
                </div>
              ) : (
                <img
                  src="/avatar_default.png"
                  alt="avatar"
                  width={98}
                  height={98}
                  style={{ borderRadius: '50%', objectFit: 'cover', background: '#f3f5fb', border: '2px solid #eef3fb' }}
                  className="mb-3"
                  onError={() => setAvatarError(true)}
                />
              )}
              <h5 className="fw-bold mb-1">{(profil.first_name || profil.prenom) ?? ""} {(profil.last_name || profil.nom) ?? ""}</h5>
              <Badge bg={profil.role === 'medecin' ? "info" : "secondary"} className="mb-2 text-uppercase" style={{ fontSize: 13 }}>
                {profil.role === 'medecin' ? "Médecin" : "Assistant"}
              </Badge>
            </Col>
            <Col md={8}>
              <Row className="mb-2">
                <Col sm={5} className="fw-semibold text-muted">Nom d&apos;utilisateur :</Col>
                <Col>{profil.username}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={5} className="fw-semibold text-muted">Email :</Col>
                <Col>{profil.email}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={5} className="fw-semibold text-muted">Téléphone :</Col>
                <Col>{profil.numero_telephone || <span className="text-muted">—</span>}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={5} className="fw-semibold text-muted">Adresse :</Col>
                <Col>{profil.adresse || <span className="text-muted">—</span>}</Col>
              </Row>
              {profil.role === 'medecin' && (
                <Row className="mb-2">
                  <Col sm={5} className="fw-semibold text-muted">Spécialité :</Col>
                  <Col>{profil.specialite || <span className="text-muted">—</span>}</Col>
                </Row>
              )}
              <Row className="mb-2">
                <Col sm={5} className="fw-semibold text-muted">Statut :</Col>
                <Col>{profil.is_active ? <span className="text-success">Actif</span> : <span className="text-danger">Inactif</span>}</Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}
