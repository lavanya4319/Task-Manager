import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {
    setError("");

    try {
      const res = await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      onLogin(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err?.response?.data || err.message || err);
      const message =
        err?.response?.data?.msg ||
        err?.response?.statusText ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <form
          className="form"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            registerUser();
          }}
        >
          <input
            type="text"
            name="fakeusernameremembered"
            autoComplete="username"
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="fakepasswordremembered"
            autoComplete="new-password"
            style={{ display: "none" }}
          />

          <h1 className="page-title">Create Account</h1>
          <p className="subtitle">Register with email and password.</p>

          <input
            className="input-field"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input-field"
            type="email"
            name="email"
            autoComplete="off"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-field"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Register
          </button>
        </form>

        {error && <div className="error-box">{error}</div>}

        <div className="link-row">
          <span>Already have an account?</span>
          <Link className="secondary-link" to="/">
            Login now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;