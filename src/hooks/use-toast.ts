
import { useState, useEffect } from "react";

const TOAST_TIMEOUT = 5000;

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionProps = Omit<ToastProps, "id">;

const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts((toasts) => toasts.slice(1));
    }, TOAST_TIMEOUT);

    return () => clearTimeout(timer);
  }, [toasts]);

  const addToast = (toast: ToastActionProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((toasts) => [...toasts, { ...toast, id }]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    dismissToast,
  };
};

// For direct use without hooks
let toastFn: ((props: ToastActionProps) => string) | null = null;

// Singleton toast function
export const toast = (props: ToastActionProps) => {
  if (toastFn) {
    return toastFn(props);
  }
  
  // If toast function not yet set up, queue it for next tick
  console.warn("Toast called before it was initialized");
  setTimeout(() => {
    if (toastFn) {
      toastFn(props);
    }
  }, 0);
  
  return "";
};

// Setup toast provider to connect the hook and the direct function
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useToast();
  
  useEffect(() => {
    toastFn = addToast;
    return () => {
      toastFn = null;
    };
  }, [addToast]);
  
  return <>{children}</>;
};

export { useToast };
