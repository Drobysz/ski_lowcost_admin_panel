import { LoginForm } from "../LoginForm";
import styles from "./style.module.scss";

export function LoginCard() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <section className={styles.brand}>
          <div>
            <p>Zarza-Ski Management</p>
            <h1>Admin Panel</h1>
            <span>Secure access for users, rooms, and alpine stays.</span>
          </div>
          <small>Elevated Alpine Hospitality.</small>
        </section>
        <section className={styles.formPanel}>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
