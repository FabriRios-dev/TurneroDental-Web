import { useEffect, useState } from "react";
import api from "../api/api";

const vacio = { idPaciente: "", idProfesional: "", fecha: "", hora: "" };

// La API puede devolver un string o un objeto (ProblemDetails); React no puede renderizar objetos.
function mensajeDeError(err, porDefecto) {
  const data = err.response?.data;
  if (typeof data === "string" && data) return data;
  return data?.title || data?.message || porDefecto;
}

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [form, setForm] = useState(vacio);
  const [mensaje, setMensaje] = useState("");

  function cargar() {
    return Promise.all([api.get("/turnos"), api.get("/pacientes"), api.get("/profesionales")])
      .then(([tur, pac, prof]) => {
        setTurnos(tur.data);
        setPacientes(pac.data);
        setProfesionales(prof.data);
      })
      .catch(() => setMensaje("No se pudieron cargar los turnos."));
  }

  useEffect(() => { cargar(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje("");
    try {
      await api.post("/turnos/reservar", {
        IdPaciente: Number(form.idPaciente),
        IdProfesional: Number(form.idProfesional),
        Fecha: form.fecha,
        Hora: form.hora,
      });
      setMensaje("Turno reservado correctamente.");
      setForm(vacio);
      cargar();
    } catch (err) {
      setMensaje(mensajeDeError(err, "No se pudo reservar el turno."));
    }
  }

  async function cancelar(id) {
    if (!window.confirm("¿Cancelar este turno?")) return;
    setMensaje("");
    try {
      await api.put(`/turnos/${id}/cancelar`);
      cargar();
    } catch (err) {
      setMensaje(mensajeDeError(err, "No se pudo cancelar el turno."));
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>Reservar turno</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select required value={form.idPaciente} onChange={(e) => setForm({ ...form, idPaciente: e.target.value })}>
          <option value="">Paciente...</option>
          {pacientes.map((p) => <option key={p.idPaciente} value={p.idPaciente}>{p.nombre} {p.apellido}</option>)}
        </select>
        <select required value={form.idProfesional} onChange={(e) => setForm({ ...form, idProfesional: e.target.value })}>
          <option value="">Profesional...</option>
          {profesionales.map((p) => <option key={p.idProfesional} value={p.idProfesional}>{p.nombre} {p.apellido}</option>)}
        </select>
        <input required type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
        <input required type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
        <button type="submit">Reservar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead><tr><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Profesional</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {turnos.map((t) => (
            <tr key={t.idTurno}>
              <td>{t.fecha?.split("T")[0]}</td><td>{t.hora}</td><td>{t.paciente}</td><td>{t.profesional}</td><td>{t.estado}</td>
              <td>{t.estado !== "Cancelado" && <button onClick={() => cancelar(t.idTurno)}>Cancelar</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
