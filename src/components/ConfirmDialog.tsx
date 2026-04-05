"use client";

import { useRef, useEffect, useCallback } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger" | "success";
  onConfirm: () => void;
  onCancel: () => void;
}

const variantStyles = {
  default: {
    icon: "text-[var(--primary)] bg-[var(--primary-light)]",
    button: "bg-[var(--primary)] hover:bg-[var(--primary-dark)]",
    path: "M12 8v4m0 4h.01",
    circle: true,
  },
  danger: {
    icon: "text-[var(--danger)] bg-[var(--danger-light)]",
    button: "bg-[var(--danger)] hover:bg-[var(--danger-dark)]",
    path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z",
    circle: false,
  },
  success: {
    icon: "text-[var(--primary)] bg-[var(--primary-light)]",
    button: "bg-[var(--primary)] hover:bg-[var(--primary-dark)]",
    path: "M5 13l4 4L19 7",
    circle: false,
  },
};

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const styles = variantStyles[variant];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onCancel}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto max-w-md w-full open:animate-[fadeIn_150ms_ease-out]"
    >
      <div className="bg-white rounded-lg shadow-xl border border-[var(--border-color-light)] p-6">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {styles.circle && <circle cx="12" cy="12" r="10" />}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={styles.path}
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            {cancelLabel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-md hover:bg-[var(--sidebar-bg)] hover:text-white hover:border-[var(--sidebar-bg)] transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-md transition-colors ${styles.button}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
