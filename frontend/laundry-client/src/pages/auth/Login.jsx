import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for backend login
    console.log("Login data:", { email, password });
    alert("Login submitted (backend not connected yet)");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p>Access your laundry account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don’t have an account? <a href="/auth/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
