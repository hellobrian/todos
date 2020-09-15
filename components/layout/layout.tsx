import { ReactNode } from 'react';
import Head from 'next/head';

import { Header } from 'components';
import styles from './layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>Todos</title>
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <Header></Header>
          {children}
        </main>
      </div>
    </>
  );
};
