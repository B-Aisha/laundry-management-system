import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./Auth.css";

// Import your laundry image — adjust the path to where you store it
import laundryImg from "../../assets/laundry-bg.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      const { token, user, customerId, staffId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("customerId", customerId);
      localStorage.setItem("staffId", staffId);

      const role = user.roles?.[0];
      if (role === "Admin") navigate("/admin");
      else if (role === "Staff") navigate("/staff");
      else if (role === "Customer") navigate("/customer");
      else navigate("/");

    } catch (err) {
      const message = err.response?.data;
      if (typeof message === "string") {
        setError(message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* ── Left: image panel ── */}
      <div className="auth-image-panel">
        <img src={laundryImg} alt="Fresh laundry" />
        <div className="auth-image-overlay">
          <h1>Fresh &amp; Clean,<br />Every Time.</h1>
          <p>
            Professional laundry services delivered with care.
            Your clothes deserve the best treatment.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-card">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-icon">🧺</div>
            <span className="auth-brand-name">Laundry Services</span>
          </div>

          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/auth/signup">Create one</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;