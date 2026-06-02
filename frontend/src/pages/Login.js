import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
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
        "Login failed. Please try again.";
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
            loginUser();
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

          <h1 className="page-title">Login</h1>
          <p className="subtitle">Enter your email and password to continue.</p>

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
            autoComplete="current-password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Login
          </button>
        </form>

        {error && <div className="error-box">{error}</div>}

        <div className="link-row">
          <span>New here?</span>
          <Link className="secondary-link" to="/register">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;