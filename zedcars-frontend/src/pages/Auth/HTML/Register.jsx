import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/Login.css"; 

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    role: "Customer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'phoneNumber') {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    setForm((prev) => ({ ...prev, [name]: numbersOnly }));
  } else if (name === 'fullName') {
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
    setForm((prev) => ({ ...prev, [name]: lettersOnly }));
  } else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await apiClient.post("/Auth/register", {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        username: form.username,
        password: form.password,
        role: form.role,
      });

      if (response.status === 200) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/Auth/Login"), 1500);
      } else {
        setError("Unexpected server response. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Register</h1>
        <p className="subtitle">Create your ZedCars account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-control"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="form-control"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="error-message" style={{ color: "#0f0", background: "rgba(0,255,0,0.1)" }}>
              {success}
            </div>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>

          <div className="form-footer">
            <p>
              Already have an account?{" "}
              <a href="/Auth/Login">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
