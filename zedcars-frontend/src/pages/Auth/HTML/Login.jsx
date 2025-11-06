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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </div>

          <div className="form-footer">
            <p>
              Don't have an account?{" "}
              <a href="/Auth/Register">Register</a>
            </p>
          </div>
        </form>
      </div>

      <div className="login-info">
        <h2>Welcome Back!</h2>
        <p>Sign in to access your ZedCars account and enjoy these benefits:</p>

        <div className="benefit-list">
          <div className="benefit-item">
            <div className="benefit-icon text-center">
              <i className="bi bi-globe"></i>
            </div>
            <div className="benefit-text">
              <h4>Browse Full Inventory</h4>
              <p>Access our complete collection of premium vehicles</p>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <i className="bi bi-search"></i>
            </div>
            <div className="benefit-text">
              <h4>Filter by Brand</h4>
              <p>Create a list of your favorite vehicles for later</p>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">📅</div>
            <div className="benefit-text">
              <h4>Schedule Test Drives</h4>
              <p>Book appointments to test drive your selected vehicles</p>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">🚗</div>
            <div className="benefit-text">
              <h4>Easy Purchase</h4>
              <p>Purchase Car, Accessories easily as Customer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
