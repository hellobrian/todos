import { useState } from "react";
import Router from "next/router";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import { Layout } from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";

export default function New() {
  const [errorMessage, setErrorMessage] = useState("");
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async ({ task }) => {
    if (errorMessage) setErrorMessage("");

    const query = gql`
      mutation CreateATodo($task: String!) {
        createTodo(data: { task: $task, completed: false }) {
          task
          completed
        }
      }
    `;

    try {
      await graphQLClient.request(query, { task });
      Router.push("/");
    } catch (error) {
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
            ref={register({ required: "Task is required " })}
          />
          {errors.task && (
            <span role="alert" style={{ color: "red" }}>
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
