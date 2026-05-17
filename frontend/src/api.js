import axios from "axios";

const api= axios.create({
    baseURL:'https://college-project-tlmg.onrender.com/api',
    withCredentials:true, // Allow cookies to be sent with requests
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