import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { decodeJWT } from "../../../utils/jwtUtils";
import apiClient from "../../../api/apiClient";
import { validators, validateForm } from "../../../utils/validation";import "../CSS/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [error, setError] = useState("");

  const [validationErrors, setValidationErrors] = useState({});  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    const validationRules = {
      username: [validators.required, validators.minLength(3)],
      password: [validators.required, validators.minLength(6)]
    };

    const errors = validateForm(form, validationRules);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await apiClient.post("/Auth/login", {
        username: form.username,
        password: form.password,
      });

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        localStorage.setItem("refreshToken", refreshToken);
        if (form.remember) localStorage.setItem("rememberMe", "true");
        
        login(accessToken);
        
        const decoded = decodeJWT(accessToken);
        const userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        if (userRole === 'Customer') {
          navigate("/");
        } else {
          navigate("/dashboard2");
        }
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
          <div className="login-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="login-input"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
            {validationErrors.username && <span className="error-text">{validationErrors.username}</span>}
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="login-input"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}          </div>

          <div className="login-form-group remember-me">
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

          <button type="submit" className="login-btn">
            Sign In
          </button>

          <div className="form-footer">
            <p>
              Don't have an account?{" "}
              <a href="/Auth/Register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
