import ReactDOM from "react-dom/client";
import "./index.css";
import AuthPage from "./pages/AuthPage.jsx";
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
import ArticleEditor from "./components/ArticleEditor.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* <Route path="/" element={<App />} /> */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<ContainerRecomm />} />
          <Route path="/recomm/:id" element={<BlockDetails />} />
          <Route path="/templates" element={<TemplatesSection />} />
          <Route path="/scripts" element={<ScriptSection />} />
          <Route path="/legal" element={<LegalSection />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/1" element={<ArticleEditor />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
