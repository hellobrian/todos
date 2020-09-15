import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { Layout } from 'components';

const Login = (): JSX.Element => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    if (errorMessage) setErrorMessage('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/');
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  return (
    <Layout>
      <h1>Log In</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            ref={register({ required: 'Email is required' })}
          />
          {errors.email && (
            <span role="alert" style={{ color: 'red' }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            ref={register({ required: 'Password is required' })}
          />
          {errors.password && (
            <span role="alert" style={{ color: 'red' }}>
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <button type="submit">Log in</button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
    </Layout>
  );
};

export default Login;
