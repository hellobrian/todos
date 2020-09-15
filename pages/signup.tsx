import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { Layout } from 'components';

const Signup = (): JSX.Element => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, watch, errors } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    if (errorMessage) setErrorMessage('');

    try {
      const res = await fetch('/api/signup', {
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
      <h1>Sign Up</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="e.g. john@example.com"
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
            placeholder="e.g. John-1234"
            ref={register({ required: 'Password is required' })}
          />
          {errors.password && (
            <span role="alert" style={{ color: 'red' }}>
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            name="password2"
            placeholder="e.g. John-1234"
            ref={register({
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
          />
          {errors.password2 && (
            <span role="alert" style={{ color: 'red' }}>
              {errors.password2.message}
            </span>
          )}
        </div>

        <div>
          <button type="submit">Sign up</button>
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

export default Signup;
