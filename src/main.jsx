import ReactDOM from "react-dom/client";
import "./index.css";
import AuthPage from "./pages/AuthPage.jsx";
import LandingPage from "./pages/LandingPage.jsx"; // Добавьте этот импорт
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Layout.jsx";
import ContainerRecomm from "./pages/ContainerRecomm.jsx";
import TemplatesSection from "./pages/TemplatesSection.jsx";
import ScriptSection from "./pages/ScriptSection.jsx";
import BlockDetails from "./components/BlockDetails.jsx";
import Setting from "./pages/Setting.jsx";
import LegalSection from "./pages/LegalSection.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import SubscriptionPage from "./components/SubscriptionPage.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import { RequisitesPage } from "./components/RequisitesPage.jsx";
import VerifyEmail from "./components/VerifyEmail";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <ErrorBoundary>
    <AuthProvider>
      <Routes>
        {/* Лендинг-страница как главная */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Основные страницы сайта с Layout */}
        <Route element={<Layout />}>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recomm" element={<ContainerRecomm />} /> {/* Переместили основной сайт на /app */}
          <Route path="/recomm/:id" element={<BlockDetails />} />
          <Route path="/templates" element={<TemplatesSection />} />
          <Route path="/scripts" element={<ScriptSection />} />
          <Route path="/legal" element={<LegalSection />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/requisites" element={<RequisitesPage />} />
          <Route path="/api/verify-email" element={<VerifyEmail />} />
        </Route>
        
        {/* Отдельные страницы */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </AuthProvider>
   </ErrorBoundary>
  </BrowserRouter>
);