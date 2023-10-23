import { Fragment } from 'react';
import dynamic from 'next/dynamic';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Fragment>{children}</Fragment>
);

export const NoSsrWrapper = dynamic(() => Promise.resolve(Wrapper), {
  ssr: false
});
