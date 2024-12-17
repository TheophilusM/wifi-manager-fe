import React, { useContext, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import full_logo from "../../assets/full_logo.png";
import { AuthContext } from "../../context/AuthContext";

function OTPVerification() {
  const otpRef = useRef();
  const {
    timer,
    loading,
    otpUser,
    navigate,
    setTimer,
    resendLoginOTP,
    setOtpUser,
    setLoading,
    verifyLoginOTP,
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
            return verifyLoginOTP(otpRef.current["value"]);
          }}
          className="auth-inputs"
        >
          <div className="logo">
            <img width={220} src={full_logo} alt="logo" />
          </div>
          <h5 className="auth-title">OTP Verification</h5>
          <label>Username</label>
          <input
            autoComplete="off"
            type="text"
            name="username"
            defaultValue={otpUser}
            onChange={(e) => setOtpUser(e.target.value)}
          />
          <label>OTP (shared on email)</label>
          <input autoComplete="off" type="text" name="otp" ref={otpRef} />
          <div className="forgot-psw-div">
            <span
              onClick={() => {
                setOtpUser(null);
                return navigate("/login");
              }}
            >
              Relog
            </span>
          </div>
          <button
            className={`submit-btn ${loading && "loading-btn"}`}
            disabled={loading}
          >
            {!loading ? (
              "Verify"
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
              return resendLoginOTP();
            }}
          >
            Resend
          </span>
          <code>
            {" ("}
            {timer ? timer : 0}s{")"}
          </code>
        </p>
      </div>
    </div>
  );
}

export default OTPVerification;
