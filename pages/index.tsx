import { gql } from 'graphql-request';
import Link from 'next/link';
import useSWR from 'swr';

import { Layout } from 'components';
import { getAuthCookie } from 'utils/auth-cookies';
import { graphQLClient } from 'utils/graphql-client';
import styles from './index.module.css';

type Todo = {
  _id: string;
  completed: boolean;
  task: string;
};

type HomeProps = {
  token: string;
};

export default function Home({ token }: HomeProps): JSX.Element {
  const fetcher = async (query: string) => await graphQLClient(token).request(query);
  const { data, mutate } = useSWR(
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

  const toggleTodo = async (id: string, completed: boolean) => {
    const mutation = gql`
      mutation PartialUpdateTodo($id: ID!, $completed: Boolean!) {
        partialUpdateTodo(id: $id, data: { completed: $completed }) {
          _id
          completed
        }
      }
    `;

    const variables = {
      id,
      completed: !completed
    };

    try {
      await graphQLClient(token)
        .setHeader('X-Schema-Preview', 'partial-update-mutation')
        .request(mutation, variables);
      mutate();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const deleteATodo = async (id: string) => {
    const mutation = gql`
      mutation DeleteATodo($id: ID!) {
        deleteTodo(id: $id) {
          _id
        }
      }
    `;

    try {
      await graphQLClient(token).request(mutation, { id });
      mutate();
    } catch (error) {
      // eslint-disable-next-line no-console
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
              color: 'white',
              background: 'blue',
              padding: 16,
              fontWeight: 700
            }}>
            Create New Todo
          </a>
        </Link>
      </div>
      {data ? (
        <ul>
          {data.allTodos.data.map((todo: Todo) => (
            <li key={todo._id}>
              <button
                type="button"
                onClick={() => toggleTodo(todo._id, todo.completed)}
                style={{
                  textDecorationLine: todo.completed ? 'line-through' : 'none'
                }}>
                {todo.task}
              </button>
              {' | '}
              <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                <a>Edit</a>
              </Link>
              {' | '}
              <button
                type="button"
                onClick={() => deleteATodo(todo._id)}
                style={{ background: 'red', color: 'white' }}>
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}
