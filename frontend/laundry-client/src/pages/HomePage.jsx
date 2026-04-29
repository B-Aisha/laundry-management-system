import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

// Optional: import a photo for the About section
// import aboutImg from "../../assets/laundry-about.jpg";

const HomePage = () => {
  return (
    <div>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="logo">MLB <span>Laundry</span></div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li className="login-btn"><a href="/auth/login">Login</a></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Nairobi's Trusted Laundry</span>
          <h1>
            Fresh &amp; Clean,<br />
            <em>Every Single Time.</em>
          </h1>
          <p>
            We take care of your clothes from pickup to delivery,
            keeping you informed at every stage with real-time notifications.
          </p>
          <div className="hero-actions">
            <a href="/auth/signup" className="primary-btn">Create Account</a>
            <a href="#services" className="secondary-btn">Our Services</a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>500+</strong>
            <span>Happy Customers</span>
          </div>
          <div className="hero-stat">
            <strong>24h</strong>
            <span>Turnaround Time</span>
          </div>
          <div className="hero-stat">
            <strong>4.9★</strong>
            <span>Customer Rating</span>
          </div>
          <div className="hero-stat">
            <strong>100%</strong>
            <span>Care Guarantee</span>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="services">
        <div className="services-header">
          <p className="section-label">What We Offer</p>
          <h2 className="section-title">Professional Laundry<br />Services</h2>
          <p className="section-subtitle">
            From everyday washing to delicate dry cleaning — we handle it all
            with care and precision.
          </p>
        </div>

        <div className="service-cards">
          <div className="card">
            <span className="card-icon">🫧</span>
            <h3>Wash &amp; Fold</h3>
            <p>Everyday laundry washed with quality detergents, dried, and neatly folded ready for collection.</p>
          </div>
          <div className="card">
            <span className="card-icon">👔</span>
            <h3>Dry Cleaning</h3>
            <p>Professional solvent-based cleaning for delicate fabrics, suits, and special garments.</p>
          </div>
          <div className="card">
            <span className="card-icon">♨️</span>
            <h3>Ironing</h3>
            <p>Crisp, perfectly pressed clothes steamed and ironed to a professional finish.</p>
          </div>
          <div className="card">
            <span className="card-icon">📲</span>
            <h3>Order Tracking</h3>
            <p>Real-time email and in-app notifications as your laundry moves through each stage.</p>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about">
        <div className="about-text">
          <p className="section-label">About Us</p>
          <h2 className="section-title">Small Business,<br />Big Standards.</h2>
          <p className="section-subtitle">
            MLB Laundry is a Nairobi-based laundry service built on transparency,
            reliability, and genuine care for your garments. Our digital platform
            lets you place orders, track progress, and pay seamlessly.
          </p>

          <div className="about-features">
            <div className="about-feature">
              <span className="about-feature-icon">✅</span>
              <div>
                <h4>Quality Guaranteed</h4>
                <p>Every garment treated with appropriate care based on fabric type and care labels.</p>
              </div>
            </div>
            <div className="about-feature">
              <span className="about-feature-icon">🔔</span>
              <div>
                <h4>Stay Informed</h4>
                <p>Email and in-app notifications at every step — from order placed to ready for pickup.</p>
              </div>
            </div>
            <div className="about-feature">
              <span className="about-feature-icon">💳</span>
              <div>
                <h4>Flexible Payments</h4>
                <p>Pay via M-Pesa STK push or cash on pickup — whichever works best for you.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-visual">
          <div className="about-img-wrap">
            {/* Replace the placeholder below with an <img> once you have a photo:
                <img src={aboutImg} alt="Our laundry facility" /> */}
            <div className="about-img-placeholder">
              <span>🧺</span>
              <p>Add a photo of<br />your facility here</p>
            </div>
          </div>
          <div className="about-badge">
            <strong>3+</strong>
            <span>Years of Service</span>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact">
        <p className="section-label">Get In Touch</p>
        <h2 className="section-title">Contact Us</h2>

        <div className="contact-grid">
          <div className="contact-card">
            <span className="contact-card-icon">✉️</span>
            <h4>Email</h4>
            <p>support@mbllaundry.com</p>
          </div>
          <div className="contact-card">
            <span className="contact-card-icon">📞</span>
            <h4>Phone</h4>
            <p>+254 7XX XXX XXX</p>
          </div>
          <div className="contact-card">
            <span className="contact-card-icon">📍</span>
            <h4>Location</h4>
            <p>Nairobi, Kenya</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">MLB <span>Laundry</span></div>
        <p>© {new Date().getFullYear()} MBL Laundry. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;