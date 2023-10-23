import Link from 'next/link';
import { SiNotion } from 'react-icons/si';

export default function NotFound() {
  return (
    <div className='relative flex flex-col items-center justify-center text-center min-h-[500px]'>
      <div className='absolute flex flex-col items-center justify-center w-[90%] h-[90%] text-[50vw] text-foreground/[0.02] pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <SiNotion />
      </div>
      <div className='text-lg space-y-2'>
        <h2 className='font-bold text-4xl'>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link className='underline' href='/'>
          Return Home
        </Link>
      </div>
    </div>
  );
}
