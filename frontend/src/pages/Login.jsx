import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.success) {
        // Save JWT
        localStorage.setItem("token", res.data.token);

        // Save user
        if (res.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
          );
        }

        navigate("/home");
      } else {
        setError(
          res.data.message || "Login failed"
        );
      }

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <Link
        to="/"
        className="login-back"
      >
        ← Back to Vynzo
      </Link>


      <div className="login-card">

        <div className="login-logo">
          VYNZO
        </div>

        <h1>
          Welcome back
        </h1>

        <p className="login-subtitle">
          Login to continue to Vynzo ✨
        </p>


        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="login-field">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login →"}
          </button>

        </form>


        <div className="login-divider">
          OR
        </div>


        <p className="login-register">

          Don't have an account?

          <Link to="/register">
            Create account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;