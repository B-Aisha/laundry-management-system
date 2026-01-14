import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">MLB Laundry</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li className="login-btn"><a href="/auth/login">Login</a></li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="hero">
        <h1>Reliable & Affordable Laundry Services</h1>
        <p>
          We take care of your clothes from pickup to delivery, keeping you
          informed at every stage.
        </p>
        <a href="/auth/signup" className="primary-btn">Create Account</a>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="card">
            <h3>Wash & Fold</h3>
            <p>Everyday laundry washed, dried, and neatly folded.</p>
          </div>
          <div className="card">
            <h3>Dry Cleaning</h3>
            <p>Professional care for delicate and special garments.</p>
          </div>
          <div className="card">
            <h3>Ironing</h3>
            <p>Perfectly pressed clothes ready to wear.</p>
          </div>
          <div className="card">
            <h3>Order Tracking</h3>
            <p>Get email notifications as your laundry progresses.</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about">
        <h2>About Our Laundry</h2>
        <p>
          SmartWash Laundry is a small business dedicated to providing
          high-quality laundry services with transparency and convenience.
          Our system allows customers to place orders, receive notifications,
          and track their laundry status in real time.
        </p>
      </section>

      {/* SIGN-UP & APPROVAL NOTICE */}
      <section className="approval">
        <h2>New User Registration</h2>
        <p>
          Customers without an account are required to sign up first.
          Once registered, your account will be reviewed and approved
          by the laundry manager before you can access the system.
        </p>
        <p className="note">
          📩 You will receive an email notification once your access is approved.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Email: support@mbllaundry.com</p>
        <p>Phone: +254 7XX XXX XXX</p>
        <p>Location: Nairobi, Kenya</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MBL Laundry. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
