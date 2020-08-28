import Link from "next/link";
import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";
import { Layout } from "../components/layout";
import styles from "./index.module.css";

const fetcher = async (query) => await graphQLClient.request(query);

export default function Home() {
  const { data, error, mutate } = useSWR(
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

  const toggleTodo = async (id, completed) => {
    const query = gql`
      mutation PartialUpdateTodo($id: ID!, $completed: Boolean!) {
        partialUpdateTodo(id: $id, data: { completed: $completed }) {
          _id
          completed
        }
      }
    `;

    const variables = {
      id,
      completed: !completed,
    };

    try {
      await graphQLClient.request(query, variables);
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteATodo = async (id) => {
    const query = gql`
      mutation DeleteATodo($id: ID!) {
        deleteTodo(id: $id) {
          _id
        }
      }
    `;

    try {
      await graphQLClient.request(query, { id });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

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
              <button
                type="button"
                onClick={() => toggleTodo(todo._id, todo.completed)}
                style={{
                  textDecorationLine: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.task}
              </button>
              {" | "}
              <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                <a>Edit</a>
              </Link>
              {" | "}
              <button
                type="button"
                onClick={() => deleteATodo(todo._id)}
                style={{ background: "red", color: "white" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
}
