import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roleGroups, roles } from "../constants/roles";
import { decrypt } from "../services/_crypto";
import { baseName } from "../constants/base";

export const withEcocashUserHandler = (WrappedComponent) => {
  const AuthHandler = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (
        window.sessionStorage.getItem("user") &&
        !JSON.parse(
          decrypt(window.sessionStorage.getItem("user"))
        )?.isp?.includes(roles.EcocashUser)
      )
        return navigate(baseName + "/login");
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return AuthHandler;
};

export const withAnyHandler = (WrappedComponent) => {
  const AuthHandler = (props) => {
    const navigate = useNavigate();
    let valid = false;

    useEffect(() => {
      JSON.parse(decrypt(window.sessionStorage.getItem("user")))?.isp?.forEach(
        (element) => {
          if (!valid && roleGroups.HASANY?.includes(element)) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            valid = true;
          }
        }
      );

      if (window.sessionStorage.getItem("user") && !valid)
        return navigate(baseName + "/login");
    }, [navigate, valid]);

    return <WrappedComponent {...props} />;
  };

  return AuthHandler;
};
