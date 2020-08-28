import Head from "next/head";
import styles from "./layout.module.css";

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
