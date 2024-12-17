import { toast } from "react-toastify";
import { structure } from "./theme";

// Global toast
export const networkError = () => {
  toast.error("Network error", {...structure, position: "bottom-right"});
};

export const fieldsMessage = () => {
  toast.error("All fields are required", structure);
};

export const statementError = () => {
  toast.error("Statement not found", {...structure, position: "bottom-right"});
};

export const searchFieldRequired = () => {
  toast.error("Search field is required", {...structure, position: "bottom-right"});
};

export const statementRequired = () => {
  toast.error("Search statement first", {...structure, position: "bottom-right"});
};

// Auth Context
export const accessGroupToast = () => {
  toast.error("Not registered under specified access group", {...structure, autoClose: 5000});
};

export const passwordsMessage = () => {
  toast.error("Passwords should match", structure);
};

export const acceptTermsMessage = () => {
  toast.error("Accept the T&C's to proceed", structure);
};

export const accountSuccessToast = () => {
  toast.success("Account created successfully", structure);
}; 

export const registrationFailedToast = () => {
  toast.error("Failed to create account", structure);
};

export const loginErrorToast = () => {
  toast.error("Please check your credentials", structure);
};

export const loginErrorToastMsg = (msg) => {
  toast.error(msg, {...structure, position: "bottom-right"});
};

export const verifySuccessToastMsg = (msg) => {
  toast.success(msg, {...structure, position: "bottom-right"});
};

export const errorToastMsg = (msg) => {
  toast.error(msg, {...structure, position: "bottom-right"});
};

export const successToastMsg = (msg) => {
  toast.success(msg, {...structure, position: "bottom-right"});
};

// HR Context

export const verifyEmployeeFailed = () => {
  toast.error("Employee verification failed", structure);
};

export const verifyEmployeeSuccess = () => {
  toast.success("Employee verification successful", structure);
};

export const roleUpdatedSuccess = () => {
  toast.success("Role updated successfully", structure);
};

// Line Manager Context

export const leaveApprovedToast = () => {
  toast.success("Leave request responded", structure);
};

// Surbodinate Context

export const leaveSuccessToast = () => {
  toast.success("Leave submitted successfully", structure);
};

export const planSuccessToast = () => {
  toast.success("Plan submitted successfully", structure);
};

export const leaveFailedToast = () => {
  toast.error("Failed to submit leave", structure);
};

export const loadPlansFailedToast = () => {
  toast.error("Failed to submit leave", structure);
};

export const updateLeaveFailed = () => {
  toast.error("Failed to update leave", structure);
};

export const planUpdatedSuccessToast = () => {
  toast.success("Plan updated successfully", structure);
};

export const deletePlanFailed = () => {
  toast.success("Plan deleted successfully", structure);
};

export const planDeletedSuccessToast = () => {
  toast.success("Plan deleted successfully", structure);
};