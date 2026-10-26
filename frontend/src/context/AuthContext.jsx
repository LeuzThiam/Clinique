import React, { createContext, useContext, useState, useEffect } from "react"
import { addSession, logoutSession } from "../Services/session"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))
  const [role, setRole] = useState(localStorage.getItem("role") || null)

  useEffect(() => {
    const onStorage = () => {
      setIsAuthenticated(!!localStorage.getItem("token"))
      setRole(localStorage.getItem("role"))
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const login = async (token, userRole) => {
    localStorage.setItem("token", token)
    localStorage.setItem("role", userRole)
    setIsAuthenticated(true)
    setRole(userRole)

    try {
      await addSession()
    } catch (error) {
      console.error("Erreur lors de la création de session :", error)
    }
  }

  const logout = async () => {
    try {
      await logoutSession()
    } catch (error) {
      console.warn("Erreur lors de la déconnexion :", error)
    }

    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    localStorage.removeItem("role")
    setIsAuthenticated(false)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
