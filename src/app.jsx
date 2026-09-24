import { Route, Routes, useLocation } from "react-router";
import "./app.css";
import Kanban from "./pages/kanban.jsx";
import Sobre from "./pages/sobre.jsx";
import Login from "./pages/login.jsx";
import NotFound from "./pages/404.jsx";
import Sidebar from "./componentes/sidebar.jsx";
import RotaPrivada from "./componentes/rotaprivada.jsx";

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`app-layout ${isLoginPage ? "login-layout" : ""}`}>
      {!isLoginPage && <Sidebar />}
      <main className={`app-conteudo ${isLoginPage ? "login-conteudo" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Kanban />
              </RotaPrivada>
            }
          />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
