import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';

import { setAuthCookie } from 'utils/auth-cookies';
import { guestClient } from 'utils/fauna-client';

type UserType = {
  ref: any;
};

type AuthType = {
  secret: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and Password not provided');
  }

  try {
    const existingEmail = await guestClient.query(
      // Exists returns boolean, Casefold returns normalize string
      q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email)))
    );

    if (existingEmail) {
      return res.status(400).send(`Email ${email} already exists`);
    }

    const user: UserType = await guestClient.query(
      q.Create(q.Collection('User'), {
        credentials: { password },
        data: { email }
      })
    );

    if (!user.ref) {
      return res.status(404).send('user ref is missing');
    }

    const auth: AuthType = await guestClient.query(
      q.Login(user.ref, {
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
