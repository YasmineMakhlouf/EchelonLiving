/**
 * Input
 * Frontend UI components module for Echelon Living app.
 */
import { useId, type InputHTMLAttributes } from "react";
import "../../styles/components/Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const baseClass = "input-wrapper";
  const widthClass = fullWidth ? "input-full-width" : "";
  const wrapperClass = `${baseClass} ${widthClass} ${className}`.trim();
  const inputClass = error ? "input-field input-error" : "input-field";

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClass}
        {...props}
      />
      {error && <p className="input-error-text">{error}</p>}
      {helperText && !error && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
}
