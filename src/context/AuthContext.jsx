// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    access_token: null,
    role: null,
    username: null,
    isAuthenticated: false,
    full_name: null,
  });

  // Проверка наличия токена при загрузке
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

  // Обновление access_token при истечении срока
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch("http://85.143.175.100:8080/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Не удалось обновить токен");

      const data = await response.json();
      if (!data.access_token) throw new Error("Токен не получен");

      setAuthState((prev) => ({
        ...prev,
        access_token: data.access_token,
      }));
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      logout(); // Принудительный выход при ошибке
      return null;
    }
  }, [authState.access_token]);

  // Обертка fetch с автоматическим обновлением токена
  const authFetch = useCallback(
    async (url, options = {}, retry = true) => {
      const token = authState.access_token;
      const headers = options.headers || {};
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return authFetch(url, options, false); // Повторный запрос с новым токеном
        }
      }

      return response;
    },
    [authState.access_token, refreshAccessToken]
  );

  const login = (access_token, role, username, full_name) => {
    setAuthState({
      access_token,
      role,
      username,
      isAuthenticated: true,
      full_name,
    });
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("full_name", full_name);
  };

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
        isAuthenticated: false,
        full_name: null,
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
        authFetch, // доступен во всем приложении
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
