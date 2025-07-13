// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    access_token: null,
    refresh_token: null,
    role: null,
    username: null,
    isAuthenticated: false,
    full_name: null,
  });

  // Загрузка токенов из localStorage при старте
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const full_name = localStorage.getItem("full_name");

    if (access_token && refresh_token && role && username) {
      setAuthState({
        access_token,
        refresh_token,
        role,
        username,
        full_name,
        isAuthenticated: true,
      });
    }
  }, []);

  // Обновление access_token с помощью refresh_token
  const refreshAccessToken = useCallback(async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) throw new Error("Отсутствует refresh_token");

      const response = await fetch("http://85.143.175.100:8080/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) throw new Error("Не удалось обновить токен");

      const data = await response.json();
      if (!data.access_token || !data.refresh_token) throw new Error("Некорректный ответ от сервера");

      setAuthState((prev) => ({
        ...prev,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }));

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      return data.access_token;
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      logout();
      return null;
    }
  }, []);

  // Обертка fetch с автообновлением токена при 401
  const authFetch = useCallback(
    async (url, options = {}, retry = true) => {
      const token = authState.access_token;
      const headers = new Headers(options.headers || {});
headers.set("Authorization", `Bearer ${token}`);


      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return authFetch(url, options, false);
        }
      }

      return response;
    },
    [authState.access_token, refreshAccessToken]
  );

  // Логин: устанавливает access + refresh токены
  const login = (access_token, refresh_token, role, username, full_name) => {
    setAuthState({
      access_token,
      refresh_token,
      role,
      username,
      full_name,
      isAuthenticated: true,
    });

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
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
        refresh_token: null,
        role: null,
        username: null,
        full_name: null,
        isAuthenticated: false,
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
