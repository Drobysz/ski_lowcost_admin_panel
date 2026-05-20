import styles from "./style.module.scss";

export function AdminFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>Zarza-Ski</strong>
        <p>© 2024 Zarza-Ski. Elevated Alpine Hospitality.</p>
      </div>
      <nav>
        <a href="#">Legal</a>
        <a href="#">Support</a>
        <a href="#">Privacy</a>
      </nav>
    </footer>
  );
}
