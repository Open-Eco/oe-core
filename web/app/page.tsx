import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Hello World</h1>
        <p className={styles.description}>
          Welcome to Open Climate Transparency Platform
        </p>
      </main>
    </div>
  );
}
