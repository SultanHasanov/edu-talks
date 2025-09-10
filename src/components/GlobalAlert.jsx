import { useState } from "react";

export default function GlobalAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-red-600 text-white text-center p-3 fixed top-0 left-0 z-50 shadow-lg">
      <span className="font-semibold">
        ⚠️ Внимание: сегодня с 21:00 до 22:00 будут проводиться технические работы. 
        Все пользователи будут автоматически разлогинены, потребуется повторная авторизация.
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 bg-white text-red-600 px-2 py-1 rounded"
      >
        Закрыть
      </button>
    </div>
  );
}
