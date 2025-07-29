import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    if (state.token) {
      // Verify token is still valid
      api
        .get("/auth/me")
        .then((response) => {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: response.data.data,
              token: state.token,
            },
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.token]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
