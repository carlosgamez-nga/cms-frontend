import { Button } from '@/components/ui/button';
import ngaIconH from '/public/logo-h.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <div className='flex items-center flex-col gap-8'>
        <Image src={ngaIconH} alt='NGA healtcare icon' width={200} />
        <h1 className='text-center text-4xl font-bold'>
          Contract Management System
        </h1>
      </div>
      <p>The best way to manage your contracts</p>
      <div className='flex gap-2 items-center'>
        <Button asChild>
          <Link href='/sign-in'>Sign in</Link>
        </Button>
        <small>or</small>
        <Button asChild variant='outline'>
          <Link href='/sign-up'>Sign up</Link>
        </Button>
      </div>
    </>
  );
}
