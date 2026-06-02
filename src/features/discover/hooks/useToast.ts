import { useCallback, useRef, useState } from "react";
import { TOAST_DURATION_MS } from "../constants/discover.constants";
import type { ToastState, ToastType } from "../model/discover.types";

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "error") => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setToast({ message, type });

    timeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION_MS);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}