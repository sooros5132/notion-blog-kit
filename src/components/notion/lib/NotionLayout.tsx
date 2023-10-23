import { PropsWithChildren } from 'react';

export function NotionLayout({ children }: PropsWithChildren) {
  return <div className='max-w-article mx-auto mt-10 px-3 sm:px-4'>{children}</div>;
}
