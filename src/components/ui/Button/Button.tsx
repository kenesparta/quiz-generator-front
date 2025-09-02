import React from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "success" | "error" | "warning";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button that determines a color scheme
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   */
  size?: ButtonSize;

  /**
   * Button type for form handling
   */
  type?: ButtonType;

  /**
   * Whether the button should take the full width of its container
   */
  fullWidth?: boolean;

  /**
   * Whether the button is in the loading state
   */
  loading?: boolean;

  /**
   * Icon to display before the button text
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display after the button text
   */
  endIcon?: React.ReactNode;

  /**
   * Button content
   */
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  type = "button",
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  className = "",
  children,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;

  return (
    <button type={type} className={buttonClasses} disabled={isDisabled} aria-disabled={isDisabled} {...props}>
      {!loading && startIcon && <span className={styles.icon}>{startIcon}</span>}
      <span>{children}</span>
      {!loading && endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
