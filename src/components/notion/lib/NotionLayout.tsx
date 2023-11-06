import { PropsWithChildren } from 'react';

export function NotionLayout({ children }: PropsWithChildren) {
  return <div className='max-w-article mx-auto mt-10 px-4 sm:px-5'>{children}</div>;
}
