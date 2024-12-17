import React, { useContext, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import full_logo from "../../assets/full_logo.png";
import { AuthContext } from "../../context/AuthContext";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [passVisibiliy, setPassVisibiliy] = useState(false);
  const { loading, setLoading, loginUser, navigate } = useContext(AuthContext);

  useEffect(() => {
    window.sessionStorage.removeItem("user");
    window.localStorage.removeItem("iso");
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container-center">
      <div className="box-shadow auth-container">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true); // Set loading to true before calling loginUser
            await loginUser(
              usernameRef.current["value"],
              passwordRef.current["value"]
            );
            setLoading(false); // Set loading to false after loginUser execution
          }}
          className="auth-inputs"
        >
          <div className="logo">
            <img width={220} src={full_logo} alt="logo" />
          </div>
          <h5 className="auth-title">Login</h5>
          <label htmlFor="username">Username</label>
          <input
            autoComplete="off"
            type="text"
            name="username"
            id="username"
            ref={usernameRef}
          />
          <label
            htmlFor="password"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Password
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
            id="password"
            ref={passwordRef}
          />
          <div className="forgot-psw-div">
            <span
              onClick={() => {
                return navigate("/forgot-password");
              }}
            >
              Forgot Password
            </span>
          </div>
          <button
            className={`submit-btn ${loading && "loading-btn"}`}
            disabled={loading}
          >
            {!loading ? (
              "Proceed"
            ) : (
              <BeatLoader color="rgb(5, 10, 25)" size={6} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
