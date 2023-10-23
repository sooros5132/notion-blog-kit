'use client';

import { AppProgressBar } from 'next-nprogress-bar';
import { type ProgressBarProps } from 'next-nprogress-bar';

export function NextNProgressProvider({ ...props }: ProgressBarProps) {
  return <AppProgressBar {...props} />;
}
