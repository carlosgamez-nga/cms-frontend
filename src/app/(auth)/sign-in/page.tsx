'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // <-- NEW: Import useState for loading state

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import ngaIconH from '/public/logo-h.svg';

import axios from 'axios'; // <-- Existing: Import axios for API calls
import { toast } from 'sonner'; // <-- Ensure toast is imported for notifications

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Zod Schema ---
const formSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required.'),
  password: z.string().min(1, 'Password is required.'),
});
// --- End Zod Schema ---

const SigninPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // --- Core Function: handleSignIn ---
  const handleSignIn = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading state to true
    try {
      // 1. API Call: Authenticate user via Django's api-token-auth/ endpoint
      const response = await axios.post(`${API_BASE_URL}/api/api-token-auth/`, {
        username: data.identifier,
        password: data.password,
      });

      const { token } = response.data; // Extract token

      console.log('Token received from Django before sending to Next.js API route:', token); // <-- ADD THIS LINE

      if (!token) {
        throw new Error('Authentication token not received from server.');
      }

      // --- START: NEW CODE TO SET HTTP-ONLY COOKIE VIA NEXT.JS API ROUTE ---
      // 2. Call your New Next.js API Route to Set the Cookie
      const setCookieRes = await fetch('/api/auth/set-cookie', { // Make sure this path matches your route.ts location
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!setCookieRes.ok) {
        const errorData = await setCookieRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to set authentication cookie.');
      }
      // --- END: NEW CODE ---

      // REMOVE: localStorage.setItem('authToken', token); // This is no longer needed for cookie-based auth

      toast.success('Logged in successfully!');
      console.log('Login successful! Auth token cookie set.');
      router.push('/dashboard'); // Redirect to dashboard on successful login

    } catch (error) {
      console.error('Sign-in failed:', error);
      let errorMessage = 'An unexpected error occurred during sign-in.';

      if (axios.isAxiosError(error) && error.response) {
        console.error("Django API Error Details:", error.response.data);

        if (error.response.status === 400 || error.response.status === 401) {
          const apiErrorData = error.response.data;
          if (apiErrorData.detail) {
            errorMessage = apiErrorData.detail;
          } else if (apiErrorData.non_field_errors) {
            errorMessage = apiErrorData.non_field_errors.join(', ');
          } else {
            errorMessage = JSON.stringify(apiErrorData);
          }
        } else {
          errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        }
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage); // Display error to the user
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  // --- End handleSignIn Function ---


  return (
    <>
      <Card className='w-full max-w-xl py-10 px-14'>
        <CardHeader className='flex flex-col justify-center items-center gap-6'>
          <Image src={ngaIconH} alt='NGA healtcare icon' width={200} />
          <CardTitle className='text-2xl font-semibold'>
            Sign in to your account
          </CardTitle>
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