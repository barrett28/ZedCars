import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/Auth/login", {
        username: form.username,
        password: form.password,
      });

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        localStorage.setItem("jwtToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        if (form.remember) localStorage.setItem("rememberMe", "true");
        navigate("/Admin/Dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      {/* Centered Login Box */}
      <div className="login-form">
        <h1>Sign In</h1>
        <p className="subtitle">Access your ZedCars account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-group remember-me">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Sign In
          </button>

          <div className="form-footer">
            <p>
              Don’t have an account?{" "}
              <a href="/Auth/Register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
