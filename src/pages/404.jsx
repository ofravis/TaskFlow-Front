import { Link } from "react-router";
import styles from "./404.module.css";

const NotFound = () => {
  return (
    <div className={styles.pagina}>
      <h1 className={styles.erro404}>404</h1>
      <p>A página que você está procurando não existe.</p>
      <Link className={styles.btnNothing} to="/">
        Voltar ao início
      </Link>
    </div>
  );
};

export default NotFound;
