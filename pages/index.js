import Head from "next/head";
import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";
import styles from "../styles/Home.module.css";

const fetcher = async (query) => await graphQLClient.request(query);

export default function Home() {
  const { data, error } = useSWR(
    gql`
      {
        allTodos {
          data {
            _id
            task
            completed
          }
        }
      }
    `,
    fetcher
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Todos</h1>
        {data ? (
          <ul>
            {data.allTodos.data.map((todo) => (
              <li key={todo._id}>
                <span>{todo.task}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Loading...</div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
