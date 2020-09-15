import { gql } from 'graphql-request';
import { NextApiRequest } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { EditForm, Layout } from 'components';
import { getAuthCookie } from 'utils/auth-cookies';
import { graphQLClient } from 'utils/graphql-client';

type TodoProps = {
  token: string;
};

export default function Todo({ token }: TodoProps): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = async (query: string) => await graphQLClient(token).request(query, { id });

  const query = gql`
    query FindATodoByID($id: ID!) {
      findTodoByID(id: $id) {
        task
        completed
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  if (error) return <div>failed to load</div>;

  return (
    <Layout>
      <h1>Edit Todo</h1>

      {data ? (
        <EditForm token={token} defaultValues={data.findTodoByID} id={id}></EditForm>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
}

type ContextType = {
  req: NextApiRequest;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps(ctx: ContextType) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}
