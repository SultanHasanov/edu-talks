import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { BrowserRouter, Route,  Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  </BrowserRouter>
);
