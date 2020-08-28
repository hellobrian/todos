import Link from "next/link";
import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";
import { Layout } from "../components/layout";
import styles from "./index.module.css";

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
    <Layout>
      <h1 className={styles.title} style={{ marginBottom: 32 }}>
        Todos
      </h1>
      <div style={{ marginBottom: 16 }}>
        <Link href="/new">
          <a
            style={{
              color: "white",
              background: "blue",
              padding: 16,
              fontWeight: 700,
            }}
          >
            Create New Todo
          </a>
        </Link>
      </div>
      {data ? (
        <ul>
          {data.allTodos.data.map((todo) => (
            <li key={todo._id}>
              <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                <a>{todo.task}</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
}
