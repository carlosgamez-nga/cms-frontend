'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import ngaIconH from '/public/logo-h.svg';
import { signInUser } from '@/features/auth/queries/sign-in-user'; // <-- IMPORT the new function

const formSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

const SigninPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { identifier: '', password: '' },
  });

  // --- REFACTORED AND SIMPLIFIED FUNCTION ---
  const handleSignIn = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // All the complex logic is now hidden in this one function call.
      // The token is never exposed to the client.
      await signInUser(data);

      toast.success('Logged in successfully!');
      // A full page reload is often better after login to refresh all server components.
      // Or use router.refresh() and then router.push()
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Sign-in failed:', error);
      // The error message now comes from our own standardized API route.
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  // --- END REFACTOR ---

  return (
    <>
      <Card className='w-full max-w-xl py-10 px-14'>
        <CardHeader className='flex flex-col justify-center items-center gap-6'>
          <Image src={ngaIconH} alt='NGA healtcare icon' width={200} />
          <CardTitle className='text-2xl font-semibold'>Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className='flex flex-col gap-8'
              onSubmit={form.handleSubmit(handleSignIn)}
            >
              <FormField
                control={form.control}
                name='identifier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter email or username...'
                        type='text'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter password...'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            Or continue with
          </span>
        </div>
        <CardFooter>
          <Button className='w-full ' asChild variant='secondary' disabled={isLoading}>
            <Link href='/'>
              <FcGoogle />
              Sign in with Google
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div className='flex gap-2 justify-center items-center mt-8'>
        <small>Don&lsquo;t have an account?</small>
        <Link href='/sign-up' className='text-xs text-primary'>
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SigninPage;