'use client';

import { AppProgressBar } from 'next-nprogress-bar';
import { type ProgressBarProps } from 'next-nprogress-bar';
import { NoSsrWrapper } from './modules/NoSsrWrapper';

export function NextNProgressProvider({ ...props }: ProgressBarProps) {
  return (
    <NoSsrWrapper>
      <AppProgressBar {...props} />
    </NoSsrWrapper>
  );
}
