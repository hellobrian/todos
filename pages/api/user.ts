import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';

import { getAuthCookie } from 'utils/auth-cookies';
import { authClient } from 'utils/fauna-client';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const token = getAuthCookie(req);

  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

  try {
    const { ref, data } = await authClient(token).query(q.Get(q.Identity()));
    res.status(200).json({ ...data, id: ref.id });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}
