import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyTextAtClipBoard(text: string) {
  if (!document.queryCommandSupported && document.queryCommandSupported('copy')) {
    return false;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  // focus() -> 사파리 브라우저 서포팅
  textarea.focus();
  // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  return true;
}
