'use client';

import { init, siteConfig } from '@/lib/site-config';
import { useLayoutEffect, useState } from 'react';

type DateTimeFormatProps = {
  date: Date;
  language?: string;
  relativeTime?: {
    now?: boolean;
    referenceDate?: Date;
    numeric?: Intl.RelativeTimeFormatNumeric;
  };
};

export function DateTimeFormat({ date, language: _language, relativeTime }: DateTimeFormatProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useLayoutEffect(() => setIsBrowser(true), []);

  if (!isValidDate(date)) {
    return <span suppressHydrationWarning>Invalid Date</span>;
  }
  if (!isBrowser) {
    return (
      <span suppressHydrationWarning>{new Intl.DateTimeFormat(init.language).format(date)}</span>
    );
  }
  const language = _language || siteConfig.language;

  if (relativeTime) {
    const { time, unit } = relativeTimeFormat(
      date,
      relativeTime.referenceDate ? relativeTime.referenceDate : new Date()
    );
    return (
      <span suppressHydrationWarning>
        {new Intl.RelativeTimeFormat(language, {
          numeric: relativeTime.numeric
        }).format(time, unit)}
      </span>
    );
  }
  return <span suppressHydrationWarning>{new Intl.DateTimeFormat(language).format(date)}</span>;
}

const timeFormats = [
  [60, 'seconds', 1], // 60
  [3600, 'minutes', 60], // 60*60, 60
  [86400, 'hours', 3600], // 60*60*24, 60*60
  [604800, 'days', 86400], // 60*60*24*7, 60*60*24
  [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
  [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
  [Infinity, 'years', 29030400] // Infinity, 60*60*24*7*4*12 -> 336
] as const;

function relativeTimeFormat(
  date: Date,
  referenceDate: Date
): { time: number; unit: Intl.RelativeTimeFormatUnit } {
  const _seconds = (date.getTime() - referenceDate.getTime()) / 1000;
  const seconds = Math.floor(Math.abs(_seconds));
  const sign = Math.sign(_seconds);

  let i = 0,
    format;
  while ((format = timeFormats[i++])) {
    if (seconds < format[0]) {
      let distance;

      if (format[1] === 'years') {
        // 윤년 처리
        distance = date.getFullYear() - referenceDate.getFullYear();
      } else {
        distance =
          sign === 1
            ? Math.floor((seconds / format[2]) * sign)
            : Math.ceil((seconds / format[2]) * sign);
      }

      return { time: distance, unit: format[1] };
    }
  }
  return { time: 0, unit: 'second' };
}

function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d as any);
}
