/**
 * Login
 * Frontend pages module for Echelon Living app.
 */
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLoginEmail, setLoginError, setLoginPassword } from "../../../store/slices/authUiSlice";
import type { RootState } from "../../../store";
import { useAuthRedux } from "../../../store/hooks/useAuthRedux";

function Login() {
  const { login } = useAuthRedux();
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.authUi.loginEmail);
  const password = useSelector((state: RootState) => state.authUi.loginPassword);
  const error = useSelector((state: RootState) => state.authUi.loginError);
  const isSubmitting = useSelector((state: RootState) => state.authUi.loginSubmitting);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setLoginError(null));

    try {
      await login(email, password);
      window.location.assign("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      dispatch(setLoginError(message));
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
          onChange={(event) => dispatch(setLoginEmail(event.target.value))}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => dispatch(setLoginPassword(event.target.value))}
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
