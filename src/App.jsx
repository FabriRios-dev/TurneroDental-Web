import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Pacientes from "./pages/Pacientes";
import Profesionales from "./pages/Profesionales";
import Turnos from "./pages/Turnos";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Login</Link>
        <Link to="/pacientes">Pacientes</Link>
        <Link to="/profesionales">Profesionales</Link>
        <Link to="/turnos">Turnos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/turnos" element={<Turnos />} />
      </Routes>
    </BrowserRouter>
  );
}