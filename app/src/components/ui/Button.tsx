/**
 * Button
 * Frontend UI components module for Echelon Living app.
 */
import { type ButtonHTMLAttributes } from "react";
import "../../styles/components/Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? "btn-full-width" : "";
  const combinedClass = `${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim();

  return (
    <button className={combinedClass} {...props} />
  );
}
