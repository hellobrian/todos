import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';

import { getAuthCookie, removeAuthCookie } from 'utils/auth-cookies';
import { authClient } from 'utils/fauna-client';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  const token = getAuthCookie(req);

  // already logged out
  if (!token) return res.status(200).end();

  try {
    await authClient(token).query(q.Logout(false));
    removeAuthCookie(res);
    res.status(200).end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}
