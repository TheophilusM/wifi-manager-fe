import React, { useContext, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import full_logo from "../../assets/full_logo.png";
import { AuthContext } from "../../context/AuthContext";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { roles } from "../../constants/roles";
import { decrypt } from "../../services/_crypto";

function ChangePassword() {
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [passVisibiliy, setPassVisibiliy] = useState(false);
  const { loading, setLoading, changePassword, navigate } =
    useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    if (!window.sessionStorage.getItem("user")) {
      return navigate("/login");
    }
    if (
      !JSON.parse(
        decrypt(window.sessionStorage.getItem("user"))
      )?.isp?.includes(roles.CHANGE_PASSWORD)
    )
      return navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container-center">
      <div className="box-shadow auth-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            return changePassword(
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
          <label>New Password</label>
          <input
            type={!passVisibiliy ? "password" : "text"}
            name="newPassword"
            ref={newPasswordRef}
            autoComplete="off"
          />
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            ConfirmPassword
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
            name="password"
            autoComplete="off"
            ref={confirmPasswordRef}
          />
          <button
            className={`submit-btn ${loading && "loading-btn"}`}
            disabled={loading}
          >
            {!loading ? (
              "Change"
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

export default ChangePassword;
