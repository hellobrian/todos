import faunadb from 'faunadb';

export const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET
});

export const authClient = (secret: string): any =>
  new faunadb.Client({
    secret
  });
