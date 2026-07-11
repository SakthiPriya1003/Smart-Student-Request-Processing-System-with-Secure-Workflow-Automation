// src/pages/Login.js
import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      if (res.data.user.role === "student") window.location = "/student";
      if (res.data.user.role === "tutor") window.location = "/tutor";
      if (res.data.user.role === "hod") window.location = "/hod";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    // UPDATED: auth-container (Colorful Mesh Background)
    <div className="auth-container">
      
      <div className="auth-card">
        
        {/* UPDATED: auth-header (Gradient Header) */}
        <div className="auth-header">
          <h3 className="mb-0">
            <i className="bi bi-person-circle me-2"></i>Welcome Back
          </h3>
          <p className="mb-0 opacity-75">Login to your account</p>
        </div>

        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Email Address</label>
            <input
              className="form-control"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-muted">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleLogin}>
            Login
          </button>
          
          <div className="text-center mt-4">
            <small className="text-muted">
              Don't have an account? <a href="/register" className="text-decoration-none fw-bold">Register</a>
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;