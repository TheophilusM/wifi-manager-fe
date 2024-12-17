import { toast } from "react-toastify";

export const structure = {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  
export const errorToast = (message) => {
  toast.error(message, structure);
};

export const successToast = (message) => {
  toast.success(message, structure);
};

export const warningToast = (message) => {
  toast.warn(message, structure);
};
