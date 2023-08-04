// toastContext.js
import { createContext } from "react";
import { ToastType } from "./constants";

interface ToastContextValue {
  dataFromChild: Toast;
  setDataFromChild: any;
}

const ToastContext = createContext<ToastContextValue>({
  dataFromChild: {
    details: "",
    showToast: false,
    title: "",
    type: ToastType.NOTHING,
  },
  setDataFromChild: () => {},
});

export default ToastContext;
