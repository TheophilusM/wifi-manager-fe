import React, { useContext, useEffect } from "react";
import full_logo from "../../assets/full_logo.png";
import { AuthContext } from "../../context/AuthContext";

function Authenticated() {
  const { loading, setLoading } = useContext(AuthContext);

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
        <div className="logo">
          <img width={220} src={full_logo} alt="logo" />
        </div>
        <p style={{ marginTop: 30 }}>Login Successful</p>
      </div>
    </div>
  );
}

export default Authenticated;
