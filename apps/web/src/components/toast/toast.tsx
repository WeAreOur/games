import React, { useEffect, useState } from "react";
import "./toast.css";

export interface ToastMessage {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

// Singleton event emitter for toast triggers
class ToastEmitter extends EventTarget {
  trigger(data: ToastMessage) {
    this.dispatchEvent(new CustomEvent("trigger", { detail: data }));
  }
}

const emitter = new ToastEmitter();
export const triggerToast = (data: ToastMessage) => emitter.trigger(data);

export const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<(ToastMessage & { id: string })[]>([]);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      const data = customEvent.detail;
      const id = Math.random().toString(36);
      const duration = data.duration || 2000;

      setToasts((prev) => [...prev, { ...data, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    emitter.addEventListener("trigger", handleTrigger);
    return () => emitter.removeEventListener("trigger", handleTrigger);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};
