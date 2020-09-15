import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql } from 'graphql-request';
import Router from 'next/router';
import useSWR from 'swr'; // add

import { Layout } from 'components';
import { graphQLClient } from 'utils/graphql-client';

type NewProps = {
  token: string;
};

export default function New({ token }: NewProps): JSX.Element {
  const { data: user } = useSWR('/api/user'); // add
  const [errorMessage, setErrorMessage] = useState('');
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async ({ task }) => {
    if (errorMessage) setErrorMessage('');

    const mutation = gql`
      mutation CreateATodo($task: String!, $owner: ID!) {
        createTodo(data: { task: $task, completed: false, owner: { connect: $owner } }) {
          task
          completed
          owner {
            _id
          }
        }
      }
    `;

    const variables = {
      task,
      owner: user && user.id
    };

    try {
      await graphQLClient(token).request(mutation, variables);
      Router.push('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  return (
    <Layout>
      <h1>Create New Todo</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="task">Task</label>
          <input
            id="task"
            type="text"
            name="task"
            ref={register({ required: 'Task is required ' })}
          />
          {errors.task && (
            <span role="alert" style={{ color: 'red' }}>
              {errors.task.message}
            </span>
          )}
        </div>

        <div>
          <button type="submit">Create</button>
        </div>
      </form>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </Layout>
  );
}
