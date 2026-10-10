# Turnero Dental Web

Frontend web para la gestión de turnos de un consultorio odontológico. Hecho con React 19, Vite y React Router.

## Funcionalidades

- **Login** de usuarios
- **Pacientes**: alta, edición, baja y listado
- **Profesionales**: alta, edición, baja y listado con especialidad
- **Turnos**: reserva y cancelación de turnos

## Requisitos

- Node.js 20 o superior
- La API del backend corriendo (por defecto en `https://localhost:44324/api`)

## Instalación y uso

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Configurar la URL de la API

Copiá `.env.example` como `.env.local` y ajustá `VITE_API_URL` si el backend corre en otra dirección:

```
VITE_API_URL=https://localhost:44324/api
```

## Scripts

| Comando           | Descripción                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desarrollo con HMR     |
| `npm run build`   | Build de producción en `dist/`     |
| `npm run preview` | Sirve el build de producción       |
| `npm run lint`    | Analiza el código con ESLint       |

## Estructura

```
src/
├── api/api.js          # Cliente axios configurado
├── pages/
│   ├── Login.jsx
│   ├── Pacientes.jsx
│   ├── Profesionales.jsx
│   └── Turnos.jsx
├── App.jsx             # Rutas y navegación
└── main.jsx
```
