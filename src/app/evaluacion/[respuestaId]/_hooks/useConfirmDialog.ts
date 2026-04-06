import { useCallback, useState } from "react";

export interface DialogState {
  open: boolean;
  title: string;
  message: string;
  variant: "default" | "danger" | "success";
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
}

const initialState: DialogState = {
  open: false,
  title: "",
  message: "",
  variant: "default",
  confirmLabel: "Confirmar",
  cancelLabel: "Cancelar",
  onConfirm: () => {},
};

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<DialogState>(initialState);

  const openDialog = useCallback((config: Omit<DialogState, "open">) => {
    setDialog({ ...config, open: true });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  return { dialog, openDialog, closeDialog };
}
