// src/api/apiClient.js
import axios from "axios";
import BASE_URL from "./config";

// ✅ Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // 🔐 token stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle expired tokens or unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized! Token may have expired.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/auth/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
