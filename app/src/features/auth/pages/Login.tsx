/**
 * Login
 * Frontend pages module for Echelon Living app.
 */
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { login as performLogin } from "../services/authService";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { user, token } = await performLogin({ email, password });
      login(user, token);
      window.location.assign("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">Welcome back</p>
          <h1>Login</h1>
          <p>Access your account, manage your cart, and continue where you left off.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting} className="auth-submit">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {error ? <p className="auth-error">{error}</p> : null}

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
