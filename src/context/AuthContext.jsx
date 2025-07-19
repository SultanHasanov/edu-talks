// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    access_token: null,
    role: null,
    username: null,
    isAuthenticated: false,
    full_name: null,
  });

  // Загрузка токенов из localStorage при старте
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const full_name = localStorage.getItem("full_name");

    if (access_token && role && username) {
      setAuthState({
        access_token,
        role,
        username,
        full_name,
        isAuthenticated: true,
      });
    }
  }, []);

  


  // Логин: устанавливает access + refresh токены
  const login = (access_token, role, username, full_name) => {
    setAuthState({
      access_token,
      role,
      username,
      full_name,
      isAuthenticated: true,
    });

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("full_name", full_name);
  };

  // Выход: удаляет токены и вызывает API logout
  const logout = async () => {
    try {
      await fetch("http://85.143.175.100:8080/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.access_token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      setAuthState({
        access_token: null,
        role: null,
        username: null,
        full_name: null,
        isAuthenticated: false,
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("full_name");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
