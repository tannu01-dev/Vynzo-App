import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/register",
        formData
      );

      console.log("REGISTER RESPONSE:", response.data);

      // Save token
      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      // Save user
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      alert("Account created successfully! 🎉");

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Back Button */}
      <Link
        to="/"
        className="register-back"
      >
        ← Back to Vynzo
      </Link>

      <div className="register-card">

        {/* Logo */}
        <div className="register-logo">
          VYNZO
        </div>

        {/* Heading */}
        <h1>
          Create your account
        </h1>

        <p className="register-subtitle">
          Join Vynzo and share your world ✨
        </p>

        {/* Error */}
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* Name + Username */}
          <div className="register-row">

            <div className="register-field">

              <label>
                Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="register-field">

              <label>
                Username
              </label>

              <input
                type="text"
                name="username"
                placeholder="@username"
                value={formData.username}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Email */}
          <div className="register-field">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password */}
          <div className="register-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />

          </div>

          <p className="password-info">
            Use at least 6 characters.
          </p>

          {/* Terms */}
          <div className="register-terms">

            <input
              type="checkbox"
              id="terms"
              required
            />

            <label htmlFor="terms">
              I agree to Vynzo's{" "}
              <a href="#">
                Terms & Conditions
              </a>
            </label>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account →"}
          </button>

        </form>

        {/* Divider */}
        <div className="register-divider">
          OR
        </div>

        {/* Login */}
        <p className="register-login">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;
