import axios from "axios";

const api= axios.create({
   baseURL:
    window.location.hostname === "localhost"

      ? "http://localhost:3008/api"

      : "https://college-project-tlmg.onrender.com/api",

});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;