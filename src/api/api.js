import axios from "axios";

// Se puede sobrescribir con VITE_API_URL en un archivo .env.local
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:44324/api",
});

export default api;
