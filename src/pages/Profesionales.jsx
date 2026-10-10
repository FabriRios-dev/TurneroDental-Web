import { useEffect, useState } from "react";
import api from "../api/api";

const vacio = { nombre: "", apellido: "", matricula: "", idEspecialidad: "" };

export default function Profesionales() {
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    return Promise.all([api.get("/profesionales"), api.get("/profesionales/especialidades")])
      .then(([prof, esp]) => {
        setProfesionales(prof.data);
        setEspecialidades(esp.data);
      })
      .catch(() => setError("No se pudieron cargar los profesionales."));
  }

  useEffect(() => { cargar(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { Nombre: form.nombre, Apellido: form.apellido, Matricula: form.matricula, IdEspecialidad: Number(form.idEspecialidad) };
    try {
      if (editandoId) await api.put(`/profesionales/${editandoId}`, payload);
      else await api.post("/profesionales", payload);
      setForm(vacio);
      setEditandoId(null);
      cargar();
    } catch {
      setError("No se pudo guardar el profesional.");
    }
  }

  function editar(p) {
    setForm({ nombre: p.nombre, apellido: p.apellido, matricula: p.matricula, idEspecialidad: p.idEspecialidad });
    setEditandoId(p.idProfesional);
  }

  function cancelarEdicion() {
    setForm(vacio);
    setEditandoId(null);
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este profesional?")) return;
    setError("");
    try {
      await api.delete(`/profesionales/${id}`);
      cargar();
    } catch {
      setError("No se pudo eliminar el profesional.");
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>Profesionales</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input required placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
        <input required placeholder="Matrícula" value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} />
        <select required value={form.idEspecialidad} onChange={(e) => setForm({ ...form, idEspecialidad: e.target.value })}>
          <option value="">Especialidad...</option>
          {especialidades.map((esp) => <option key={esp.idEspecialidad} value={esp.idEspecialidad}>{esp.nombre}</option>)}
        </select>
        <button type="submit">{editandoId ? "Guardar" : "Agregar"}</button>
        {editandoId && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead><tr><th>Nombre</th><th>Apellido</th><th>Matrícula</th><th>Especialidad</th><th></th></tr></thead>
        <tbody>
          {profesionales.map((p) => (
            <tr key={p.idProfesional}>
              <td>{p.nombre}</td><td>{p.apellido}</td><td>{p.matricula}</td><td>{p.especialidad}</td>
              <td><button onClick={() => editar(p)}>Editar</button> <button onClick={() => eliminar(p.idProfesional)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
