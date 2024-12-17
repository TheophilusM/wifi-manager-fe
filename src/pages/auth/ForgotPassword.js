import React, { useContext, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import full_logo from "../../assets/full_logo.png";
import { AuthContext } from "../../context/AuthContext";

function ForgotPassword() {
  const usernameRef = useRef();
  const { loading, setLoading, requestResetPasswordToken, navigate } =
    useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container-center">
      <div className="box-shadow auth-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            return requestResetPasswordToken(usernameRef.current["value"]);
          }}
          className="auth-inputs"
        >
          <div className="logo">
            <img width={190} src={full_logo} alt="logo" />
          </div>
          <h5 className="auth-title">Forgot Password</h5>
          <label>Username</label>
          <input
            autoComplete="off"
            type="text"
            name="username"
            ref={usernameRef}
          />
          <div className="forgot-psw-div">
            <span
              onClick={() => {
                return navigate("/reset-password");
              }}
            >
              Reset now
            </span>
          </div>
          <button
            className={`submit-btn ${loading && "loading-btn"}`}
            disabled={loading}
          >
            {!loading ? (
              "Submit"
            ) : (
              <BeatLoader color="rgb(5, 10, 25)" size={6} />
            )}
          </button>
        </form>
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

export default ForgotPassword;
