import styles from "./sidebar.module.css";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router";

function Sidebar() {
  const { logado, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive ? styles.link + " " + styles.ativo : styles.link;

  function handleSair() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>
      <nav className={styles.nav}>
        {logado && (
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
        <NavLink to="/404" className={linkClass}>
          404
        </NavLink>
      </nav>
      {logado && (
        <button className={styles["btn-sair"]} onClick={handleSair}>
          Sair
        </button>
      )}
    </aside>
  );
}
export default Sidebar;
