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
    </Layout>
  );
}
