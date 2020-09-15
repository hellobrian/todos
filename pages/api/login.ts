import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';

import { setAuthCookie } from 'utils/auth-cookies';
import { guestClient } from 'utils/fauna-client';

type AuthType = {
  secret: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and Password not provided');
  }

  try {
    const auth: AuthType = await guestClient.query(
      q.Login(q.Match(q.Index('user_by_email'), q.Casefold(email)), {
        password
      })
    );

    if (!auth.secret) {
      return res.status(404).send('auth secret is missing');
    }

    setAuthCookie(res, auth.secret);

    res.status(200).end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}
