import { useEffect, useState } from "react";
import api from "../api/api";

const vacio = { nombre: "", apellido: "", dni: "", telefono: "", email: "" };

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    return api.get("/pacientes")
      .then((res) => setPacientes(res.data))
      .catch(() => setError("No se pudieron cargar los pacientes."));
  }

  useEffect(() => { cargar(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { Nombre: form.nombre, Apellido: form.apellido, DNI: form.dni, Telefono: form.telefono, Email: form.email };
    try {
      if (editandoId) await api.put(`/pacientes/${editandoId}`, payload);
      else await api.post("/pacientes", payload);
      setForm(vacio);
      setEditandoId(null);
      cargar();
    } catch {
      setError("No se pudo guardar el paciente.");
    }
  }

  function editar(p) {
    setForm({ nombre: p.nombre, apellido: p.apellido, dni: p.dni, telefono: p.telefono, email: p.email });
    setEditandoId(p.idPaciente);
  }

  function cancelarEdicion() {
    setForm(vacio);
    setEditandoId(null);
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este paciente?")) return;
    setError("");
    try {
      await api.delete(`/pacientes/${id}`);
      cargar();
    } catch {
      setError("No se pudo eliminar el paciente.");
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>Pacientes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input required placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
        <input required placeholder="DNI" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} />
        <input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">{editandoId ? "Guardar" : "Agregar"}</button>
        {editandoId && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead><tr><th>Nombre</th><th>Apellido</th><th>DNI</th><th>Teléfono</th><th>Email</th><th></th></tr></thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.idPaciente}>
              <td>{p.nombre}</td><td>{p.apellido}</td><td>{p.dni}</td><td>{p.telefono}</td><td>{p.email}</td>
              <td><button onClick={() => editar(p)}>Editar</button> <button onClick={() => eliminar(p.idPaciente)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
