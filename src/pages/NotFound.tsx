import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className={styles.homeLink}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
