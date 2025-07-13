let accessToken = null;
let refreshToken = null;

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
};

export const fetchWithAuth = async (url, options = {}, retry = true) => {
  const finalOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(url, finalOptions);

  if (response.status === 401 && retry && refreshToken) {
    // Пытаемся обновить токен
    const refreshResponse = await fetch("http://85.143.175.100:8080/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      accessToken = data.access_token;
      refreshToken = data.refresh_token;

      // Обновляем заголовок авторизации
      finalOptions.headers.Authorization = `Bearer ${accessToken}`;

      // Повторяем исходный запрос
      return await fetch(url, finalOptions);
    } else {
      // Ошибка обновления, принудительный выход
      throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
    }
  }

  return response;
};
