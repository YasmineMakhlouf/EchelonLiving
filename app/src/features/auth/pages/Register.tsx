/**
 * Register
 * Frontend pages module for Echelon Living app.
 */
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setRegisterEmail,
  setRegisterError,
  setRegisterFieldErrors,
  setRegisterName,
  setRegisterPassword,
  setRegisterSubmitting,
} from "../../../store/slices/authUiSlice";
import type { RootState } from "../../../store";
import { useAuthRedux } from "../../../store/hooks/useAuthRedux";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuthRedux();
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.authUi.registerName);
  const email = useSelector((state: RootState) => state.authUi.registerEmail);
  const password = useSelector((state: RootState) => state.authUi.registerPassword);
  const error = useSelector((state: RootState) => state.authUi.registerError);
  const fieldErrors = useSelector((state: RootState) => state.authUi.registerFieldErrors);
  const isSubmitting = useSelector((state: RootState) => state.authUi.registerSubmitting);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    dispatch(setRegisterFieldErrors(errors));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setRegisterError(null));

    if (!validateForm()) {
      return;
    }

    dispatch(setRegisterSubmitting(true));

    try {
      await register(name, email, password);
      navigate("/products");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      dispatch(setRegisterError(message));
    } finally {
      dispatch(setRegisterSubmitting(false));
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">Create account</p>
          <h1>Register</h1>
          <p>Join Echelon Living to save favorites, track orders, and shop faster.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => dispatch(setRegisterName(event.target.value))}
          required
        />
        {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => dispatch(setRegisterEmail(event.target.value))}
          required
        />
        {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => dispatch(setRegisterPassword(event.target.value))}
          required
        />
        {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}

        <button type="submit" disabled={isSubmitting} className="auth-submit">
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
