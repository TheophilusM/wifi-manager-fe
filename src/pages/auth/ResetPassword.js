import React, { useContext, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import full_logo from "../../assets/full_logo.png";
import { AuthContext } from "../../context/AuthContext";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function ResetPassword() {
  const otpRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [passVisibiliy, setPassVisibiliy] = useState(false);
  const {
    loading,
    setLoading,
    resetPassword,
    navigate,
    emailFP,
    setEmailFP,
    timer,
    setTimer,
    resendFPOTP,
  } = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }

    if (timer === 0) {
      setTimer(null);
    }

    if (!timer) return;

    const intervalId = setInterval(() => {
      setTimer((prev) => --prev);
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  return (
    <div className="main-container-center">
      <div className="box-shadow auth-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            return resetPassword(
              otpRef.current["value"],
              newPasswordRef.current["value"],
              confirmPasswordRef.current["value"]
            );
          }}
          className="auth-inputs"
        >
          <div className="logo">
            <img width={220} src={full_logo} alt="logo" />
          </div>
          <h5 className="auth-title">Change Password</h5>
          <label>Username</label>
          <input
            autoComplete="off"
            type="text"
            name="email"
            defaultValue={emailFP}
            onChange={(e) => setEmailFP(e.target.value)}
          />
          <label>OTP (shared on email)</label>
          <input autoComplete="off" type="text" name="otp" ref={otpRef} />
          <label>New Password</label>
          <input
            type={!passVisibiliy ? "password" : "text"}
            name="newPassword"
            ref={newPasswordRef}
            autoComplete="off"
          />
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            Confirm Password
            <div className="show-hide-password">
              {!passVisibiliy ? (
                <MdVisibility
                  style={{ cursor: "pointer" }}
                  onClick={() => setPassVisibiliy(true)}
                />
              ) : (
                <MdVisibilityOff
                  style={{ cursor: "pointer" }}
                  onClick={() => setPassVisibiliy(false)}
                />
              )}
            </div>
          </label>
          <input
            type={!passVisibiliy ? "password" : "text"}
            name="confirmPassword"
            ref={confirmPasswordRef}
            autoComplete="off"
          />
          <button
            className={`submit-btn ${loading && "loading-btn"}`}
            disabled={loading}
          >
            {!loading ? (
              "Reset"
            ) : (
              <BeatLoader color="rgb(5, 10, 25)" size={6} />
            )}
          </button>
        </form>
        <p className="link-prefix">
          Did not receive an OTP?{" "}
          <span
            className="link"
            style={{
              cursor: timer ? "default" : "pointer",
              color: timer && "lightblue",
            }}
            onClick={() => {
              if (timer) {
                return;
              }
              return resendFPOTP();
            }}
          >
            Resend
          </span>
          <code>
            {" ("}
            {timer ? timer : 0}s{")"}
          </code>
        </p>
        <p className="link-prefix">
          Return to login page?{" "}
          <span
            className="link"
            onClick={() => {
              return navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
