import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/auth/Login";
import { AuthContext } from "../context/AuthContext";

// Mock AuthContext
const mockAuthContext = {
  loginUser: jest.fn(),
  loading: false,
  setLoading: jest.fn(),
  navigate: jest.fn(),
};

// Custom render function to include the AuthContext
const renderWithAuthContext = (
  ui,
  { providerValue = mockAuthContext, ...renderOptions } = {}
) => {
  return render(
    <AuthContext.Provider value={providerValue}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

test("should handle successful login", async () => {
  renderWithAuthContext(<Login />);

  userEvent.type(screen.getByLabelText(/username/i), "testuser");
  userEvent.type(screen.getByLabelText(/password/i), "testpassword");
  userEvent.click(screen.getByRole("button", { name: /proceed/i }));

  await waitFor(() => {
    expect(mockAuthContext.setLoading).toHaveBeenCalledWith(true);
  });

  // Mock the successful login behavior
  await waitFor(() => {
    expect(mockAuthContext.loginUser).toHaveBeenCalledWith(
      "testuser",
      "testpassword"
    );
  });

  // Check that loading is set to false after loginUser completes
  await waitFor(() => {
    expect(mockAuthContext.setLoading).toHaveBeenCalledWith(false);
  });
});