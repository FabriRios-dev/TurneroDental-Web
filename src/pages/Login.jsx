import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/login", { nombreUsuario, contrasena });
      navigate("/pacientes");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "40px auto" }}>
      <h2>Turnero Dental</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} /><br /><br />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} /><br /><br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
      <p style={{ fontSize: 13 }}>Prueba: jperez / 123456</p>
    </div>
  );
}