import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export const Header = (): JSX.Element => {
  const router = useRouter();

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data: user, mutate: mutateUser } = useSWR('/api/user', fetcher);

  const logout = async () => {
    const res = await fetch('/api/logout');
    if (res.ok) {
      mutateUser(null);
      router.push('/login');
    }
  };

  return (
    <div>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>

          <ul>
            {user ? (
              <>
                <li>
                  <Link href="/profile">
                    <a>{user.email}</a>
                  </Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                </li>
                <li>
                  <Link href="/signup">
                    <a>Signup</a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};
