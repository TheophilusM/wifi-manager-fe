// Global Styles
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Other Imports
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Loading from "./components/Loading";
import { AuthContextProvider } from "./context/AuthContext";
import { ModalsContextsProvider } from "./context/ModalsContexts";
import { ServicesContextProvider } from "./context/ServicesContext";
import { baseName } from "./constants/base";

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Authenticated = lazy(() => import("./pages/Authenticated"));

const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));
const OTPVerification = lazy(() => import("./pages/auth/OTPVerification"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const NoRoutes = lazy(() => import("./pages/404/NoRoutes"));
const NotFound = lazy(() => import("./pages/404/NotFound"));

// Service Pages
const EcocashAccounts = lazy(() => import("./pages/tabs/EcocashAccounts"));
const EcocashAccountsDetails = lazy(() =>
  import("./pages/tabs/EcocashAccountsDetails")
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <AuthContextProvider>
          <ModalsContextsProvider>
            <ServicesContextProvider>
              <Routes>
                {/* Authentication */}
                <Route path={baseName + "/login"} element={<Login />} />
                <Route
                  path={baseName + "/authenticated"}
                  element={<Authenticated />}
                />
                <Route
                  path={baseName + "/change-password"}
                  element={<ChangePassword />}
                />
                <Route
                  path={baseName + "/otp-verification"}
                  element={<OTPVerification />}
                />
                <Route
                  path={baseName + "/forgot-password"}
                  element={<ForgotPassword />}
                />
                <Route
                  path={baseName + "/reset-password"}
                  element={<ResetPassword />}
                />

                {/* Authorization */}
                <Route
                  path={baseName + "/unauthorized"}
                  element={<NoRoutes />}
                />

                {/* Core */}
                <Route
                  path={baseName + "/ecocash-accounts"}
                  element={<EcocashAccounts />}
                />
                <Route
                  path={baseName + "/ecocash-accounts/client-details/:id"}
                  element={<EcocashAccountsDetails />}
                />
                {/* Not Found */}
                <Route path={baseName + "/not-found"} element={<NotFound />} />
                <Route
                  path={baseName + "/"}
                  element={<Navigate to="/login" replace />}
                />
                <Route
                  path={baseName + "*"}
                  element={<Navigate to="/not-found" replace />}
                />
              </Routes>
            </ServicesContextProvider>
          </ModalsContextsProvider>
        </AuthContextProvider>
      </Suspense>
    </Router>
  );
}

export default App;
