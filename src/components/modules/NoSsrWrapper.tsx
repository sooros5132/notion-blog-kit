import type React from 'react';
import { Fragment } from 'react';
import dynamic from 'next/dynamic';

const NoSsrWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Fragment>{children}</Fragment>
);

export default dynamic(() => Promise.resolve(NoSsrWrapper), {
  ssr: false
});
