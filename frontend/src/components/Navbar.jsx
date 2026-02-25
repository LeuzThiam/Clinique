
import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/components/navbar.css";

const MENU = {
    medecin: [
        { to: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
        { to: "/patients", label: "Patients", icon: "bi-people-fill" },
        { to: "/rendezvous", label: "Rendez-vous", icon: "bi-calendar-check" },
        { to: "/consultations", label: "Consultations", icon: "bi-journal-medical" },
        { to: "/dossiers", label: "Dossiers", icon: "bi-folder2-open" },
        { to: "/prescriptions", label: "Prescriptions", icon: "bi-capsule" },
        { to: "/prescription-details", label: "Ordonnances", icon: "bi bi-prescription2" },
    ],
    assistant: [
        { to: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
        { to: "/patients", label: "Patients", icon: "bi-people-fill" },
        { to: "/rendezvous", label: "Rendez-vous", icon: "bi-calendar-check" },


    ]
};

export default function Navbar() {
    const { isAuthenticated, role, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdown, setDropdown] = useState(false);
    const [mobile, setMobile] = useState(false);
    const refDropdown = useRef();
    const userName = localStorage.getItem("user_name") || (role === "medecin" ? "Médecin" : "Assistant");

    useEffect(() => {
        function handleClick(e) {
            if (dropdown && refDropdown.current && !refDropdown.current.contains(e.target)) setDropdown(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [dropdown]);

    if (!isAuthenticated) return null;

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

    const menu = MENU[role] || [];

    // Menu principal (desktop)
    const MenuLinks = (
        <ul className="navbar-links">
            {menu.map(({ to, label, icon }) => (
                <li key={to}>
                    <Link to={to} className={`navbar-link${isActive(to) ? " active" : ""}`}>
                        <i className={`me-2 ${icon}`}></i>{label}
                    </Link>
                </li>
            ))}
        </ul>
    );

    // Profil (desktop)
    const Profil = (
        <div className="navbar-profil-list" ref={refDropdown}>
            <button className={`btn-profil navbar-link${dropdown ? " active" : ""}`} onClick={() => setDropdown(d => !d)}>
                <i className="bi bi-person-circle me-1 text-primary" style={{ fontSize: 22 }}></i>
                <span className="profil-nom">{userName}</span>
                <i className="bi bi-chevron-down ms-1"></i>
            </button>
            {dropdown &&
                <ul className="profil-dropdown">
                    <li>
                        <Link to="/profil" className="dropdown-item-custom" onClick={() => setDropdown(false)}>
                            <i className="bi bi-person-lines-fill me-2"></i> Profil
                        </Link>
                    </li>

                    <li><div className="dropdown-divider-custom" /></li>
                    <li>
                        <button className="dropdown-item-custom text-danger" onClick={() => { logout(); localStorage.removeItem("user_name"); setDropdown(false); navigate("/login"); }}>
                            <i className="bi bi-box-arrow-right me-2"></i> Déconnexion
                        </button>
                    </li>
                </ul>
            }
        </div>
    );

    // Menu mobile
    const MobileMenu = (
        <div className="burger-menu-overlay" onClick={() => setMobile(false)}>
            <div className="burger-menu" onClick={e => e.stopPropagation()}>
                <button className="burger-close" onClick={() => setMobile(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>
                <ul>
                    {menu.map(({ to, label, icon }) => (
                        <li key={to}>
                            <Link to={to} className={`navbar-link${isActive(to) ? " active" : ""}`} onClick={() => setMobile(false)}>
                                <i className={`me-2 ${icon}`}></i>{label}
                            </Link>
                        </li>
                    ))}
                    <li style={{ borderTop: "1px solid #e5e9f0", marginTop: 8, paddingTop: 8 }}>
                        <Link to="/profil" className="navbar-link" onClick={() => setMobile(false)}>
                            <i className="bi bi-person-lines-fill me-2"></i> Profil
                        </Link>
                        <button className="navbar-link" onClick={() => { alert("Aucune notification non lue."); setMobile(false); }}>
                            <i className="bi bi-bell me-2"></i> Notifications
                        </button>
                        <button className="navbar-link text-danger" onClick={() => { logout(); localStorage.removeItem("user_name"); setMobile(false); navigate("/login"); }}>
                            <i className="bi bi-box-arrow-right me-2"></i> Déconnexion
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <nav className="navbar-custom shadow-sm">
            <div className="navbar-inner">
                {/* Logo et titre */}
                <div className="navbar-brand-custom">
                    <img src="/logo_clinique.png" alt="Logo" className="logo-navbar" />
                    <span className="titre-app">
                        Clinique Santé<span style={{ color: "#1270ec" }}>+</span>
                    </span>
                </div>
                {/* Desktop Links */}
                <div className="navbar-links-outer">
                    <button className="burger-btn-only" onClick={() => setMobile(true)}>
                        <i className="bi bi-list"></i>
                    </button>
                    {MenuLinks}
                    {Profil}
                </div>
            </div>
            {mobile && MobileMenu}
        </nav>
    );
}
