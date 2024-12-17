import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorToast, successToast } from "../constants/toastAlerts";
import axios from "axios";
import { AUTH_URL, systemId } from "../constants/base";
import jwt_decode from "jwt-decode";
import { roles } from "../constants/roles";
import Modal from "react-bootstrap/Modal";
import { decrypt, encrypt } from "../services/_crypto";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [idle, setIdle] = useState(false);
  const [emailCP, setEmailCP] = useState("");
  const [emailFP, setEmailFP] = useState("");
  const [otpUser, setOtpUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(600);

  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [loadingPasswordDetails, setLoadingPasswordDetails] = useState(false);
  const [loadingUserSystems, setLoadingUserSystems] = useState(false);
  const [loadingAllSystems, setLoadingAllSystems] = useState(false);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const paths = [
    "/login",
    "/otp-verification",
    "/forgot-password",
    "/reset-password",
    "/unauthorized",
  ];

  const handleOpenModal = () => setIdle(true);

  const handleCloseModal = () => {
    logoutUser();
    return setIdle(false);
  };

  // AUTHENTICATION

  const logoutUser = () => {
    window.sessionStorage.clear();
    return navigate("/login");
  };

  const loginUser = async (username, password) => {
    setLoading(true);

    if (!username || !password) {
      setLoading(false);
      errorToast("All fields are required");
      return;
    }

    try {
      const response = await axios(
        `${AUTH_URL}/auth/login/${username}/${password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Frame-Options": "DENY",
            "frame-ancestors": "self",
          },
          data: JSON.stringify({ username, password, systemId }),
        }
      );

      if (response?.data?.token) {
        const decoded = jwt_decode(response.data?.token);
        console.log(decoded);
      }
      successToast("Authentication Successful!");
      navigate("/authenticated");
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const verifyLoginOTP = async (otp) => {
    setLoading(true);

    if (!otpUser) {
      setLoading(false);
      errorToast("Username input required");
      return;
    }

    if (!otp) {
      setLoading(false);
      errorToast("OTP input required");
      return;
    }

    try {
      const response = await axios(
        `${AUTH_URL}/auth/login-with-otp/${otpUser}/${otp}/${systemId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Frame-Options": "DENY",
            "frame-ancestors": "self",
          },
        }
      );

      setLoading(false);
      var userRoles = [];
      if (response?.data?.token) {
        const decoded = jwt_decode(response.data?.token);
        decoded?.roles?.forEach((role) => {
          userRoles.push(roles[role.replace(systemId + "_", "")]);
        });
        window.sessionStorage.setItem(
          "user",
          encrypt(
            JSON.stringify({
              it: decoded?.it,
              isp: userRoles,
              jwtToken: response?.data?.token,
            })
          )
        );
        if (userRoles?.includes(roles["EcocashUser"]))
          return navigate("/ecocash-accounts");
        errorToast("Unauthorized Access");
      }
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const resendLoginOTP = async () => {
    setLoading(true);

    if (!otpUser) {
      setLoading(false);
      errorToast("Username input required");
      return;
    }

    try {
      const response = await axios(
        `${AUTH_URL}/auth/resend-login-otp/${otpUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Frame-Options": "DENY",
            "frame-ancestors": "self",
          },
        }
      );

      if (response?.data) {
        setTimer(60);
        setLoading(false);
        successToast(response?.data?.info);
        return;
      }
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const requestResetPasswordToken = async (username) => {
    setLoading(true);

    if (!username) {
      errorToast("username input is required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios(
        `${AUTH_URL}/auth/forgot-password/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Frame-Options": "DENY",
            "frame-ancestors": "self",
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setEmailFP(username);
        successToast(response?.data?.info);
        return navigate("/reset-password");
      }
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const resetPassword = async (otp, newPassword, confirmPassword) => {
    setLoading(true);

    if (!otp || !newPassword || !confirmPassword || !emailFP) {
      errorToast("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios(
        `${AUTH_URL}/auth/change-forgotten-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Frame-Options": "DENY",
            "frame-ancestors": "self",
          },
          data: JSON.stringify({
            username: emailFP,
            otp,
            newPassword,
            confirmPassword,
          }),
        }
      );

      setLoading(false);
      successToast(response?.data?.info);
      return navigate("/login");
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const changePassword = async (newPassword, confirmPassword) => {
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      errorToast("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios(`${AUTH_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Frame-Options": "DENY",
          "frame-ancestors": "self",
          Authorization: `Bearer ${
            JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.jwtToken
          }`,
        },
        data: JSON.stringify({ newPassword, confirmPassword }),
      });

      setLoading(false);
      successToast(response?.data?.info);
      window.sessionStorage.removeItem("user");
      return navigate("/login");
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  const resendFPOTP = async () => {
    setLoading(true);

    if (!emailFP) {
      setLoading(false);
      errorToast("Username input required");
      return;
    }

    try {
      const response = await axios(
        `${AUTH_URL}/auth/resend-forgot-password-otp/${emailFP}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Frame-Options": "DENY",
            "frame-ancestors": "self",
          },
        }
      );

      if (response?.data) {
        setTimer(60);
        setLoading(false);
        successToast(response?.data?.info);
        return;
      }
    } catch (e) {
      setLoading(false);

      if (
        e.response?.status?.toString()?.startsWith(401) ||
        e.response?.status?.toString()?.startsWith(403)
      ) {
        navigate("/login");
        return errorToast("Your session expired");
      }
      if (e.response?.status?.toString()?.startsWith(4)) {
        return errorToast(
          e?.response?.data?.info ||
            Object.values(e?.response?.data?.errors)?.[0]?.[0]?.toString()
        );
      }
      errorToast("Network or server challenge");
    }
  };

  // EVENTS
  useEffect(() => {
    if (
      !window.sessionStorage.getItem("user") &&
      !paths.includes(window.location.pathname)
    ) {
      navigate("/login");
    }

    window.document.addEventListener("click", () => {
      if (!paths.includes(window.location.pathname)) {
        setSessionTimer(600);
      }
    });

    if (sessionTimer === 0) {
      window.sessionStorage.clear();
      handleOpenModal();
    }

    if (!sessionTimer) return;

    const intervalId = setInterval(() => {
      if (!paths.includes(window.location.pathname)) {
        setSessionTimer((prev) => --prev);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimer]);

  // VALUES
  const value = {
    timer,
    otpUser,
    loading,
    emailCP,
    emailFP,
    loadingAllSystems,
    loadingUserDetails,
    loadingUserSystems,
    loadingDepartments,
    loadingSubsidiaries,
    loadingPasswordDetails,
    setTimer,
    navigate,
    loginUser,
    setOtpUser,
    setEmailCP,
    setEmailFP,
    logoutUser,
    setLoading,
    resendFPOTP,
    resetPassword,
    changePassword,
    resendLoginOTP,
    verifyLoginOTP,
    setLoadingDepartments,
    setLoadingAllSystems,
    setLoadingUserDetails,
    setLoadingUserSystems,
    setLoadingSubsidiaries,
    setLoadingPasswordDetails,
    requestResetPasswordToken,
  };

  return (
    <div>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal className="modal" show={idle} onHide={handleCloseModal}>
        <div className="modal-container">
          <p className="heading" style={{ fontSize: 18 }}>
            Session Expired
          </p>
          <p style={{ textAlign: "center" }}>
            You have been inactive for more than 10 minutes, kindly login again
          </p>
          <br />
          <div
            style={{ justifyContent: "center", marginTop: -20 }}
            className="modal-btn-section"
          >
            <button
              style={{ background: "darkgrey" }}
              onClick={() => {
                return handleCloseModal();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
