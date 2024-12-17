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
const NoRoutes = lazy(() => import("./pages/404/NoRoutes"));
const NotFound = lazy(() => import("./pages/404/NotFound"));

// Service Pages
const Authenticated = lazy(() => import("./pages/tabs/Authenticated"));

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

                {/* Authorization */}
                <Route
                  path={baseName + "/unauthorized"}
                  element={<NoRoutes />}
                />

                {/* Core */}
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
