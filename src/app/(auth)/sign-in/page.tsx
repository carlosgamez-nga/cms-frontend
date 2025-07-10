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

import axios from 'axios'; // <-- NEW: Import axios for API calls

// --- Configuration: Adjust this to your Django backend's URL ---
const API_BASE_URL = 'http://localhost:8000/api'; // Make sure this matches your Django server
// --- End Configuration ---

// --- Zod Schema ---
const formSchema = z.object({
  // 'identifier' will accept either email or username
  identifier: z.string().min(1, 'Email or username is required.'),
  
  password: z
    .string()
    .min(1, 'Password is required.'), // Changed min length for login, as validation is handled by Django
    // Removed strict password refine for login, as Django handles this.
    // .refine((password) => {
    //   return /^(?=.*[!@#$%^&*])(?=.*[A-Z]).*$/.test(password);
    // }, 'The password must contain at least 1 uppercase letter and 1 special character'),
  
  // Removed 'acceptTerms' as it's not a login field.
});
// --- End Zod Schema ---


const SigninPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // <-- NEW: State to manage loading status

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      password: '',
      // Removed default for acceptTerms as it's no longer in schema
    },
  });

  // --- Core Function: handleSignIn (formerly handleSubmit) ---
  const handleSignIn = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading state to true
    try {
      // API Call: Authenticate user via Django's api-token-auth/ endpoint
      // This endpoint expects 'username' and 'password' in the payload.
      // Your CustomAuthToken view will intelligently handle if 'username' is an email.
      const response = await axios.post(`${API_BASE_URL}/api-token-auth/`, {
        username: data.identifier, // Send the 'identifier' as 'username' to Django
        password: data.password,
      });

      const { token, user_id, email } = response.data; // Extract token and other user data
      localStorage.setItem('authToken', token); // Store the authentication token

      // You can store more user data if needed, e.g.:
      // localStorage.setItem('userId', user_id);
      // localStorage.setItem('userEmail', email);

      console.log('Login successful! Token:', token);
      router.push('/dashboard'); // Redirect to dashboard on successful login

    } catch (error) {
      console.error('Sign-in failed:', error);
      let errorMessage = 'An unexpected error occurred during sign-in.';

      if (axios.isAxiosError(error) && error.response) {
        // Log full Django error details for debugging
        console.error("Django API Error Details:", error.response.data);

        if (error.response.status === 400 || error.response.status === 401) {
          // These status codes typically indicate invalid credentials or validation errors
          const apiErrorData = error.response.data;
          if (apiErrorData.detail) {
            errorMessage = apiErrorData.detail; // Django REST Framework's default error message
          } else if (apiErrorData.non_field_errors) {
            errorMessage = apiErrorData.non_field_errors.join(', ');
          } else {
            // Catch other possible errors returned by Django if structure differs
            errorMessage = JSON.stringify(apiErrorData);
          }
        } else {
          // Other server errors (e.g., 500)
          errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        }
      } else {
        // Network errors or other non-Axios errors
        errorMessage = error.message;
      }

      console.error(`Sign-in failed: ${errorMessage}`); // Display a user-friendly error
      // You could use a UI component for displaying this message to the user, like a toast.
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
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
              // IMPORTANT: Link form submission to the new handleSignIn function
              onSubmit={form.handleSubmit(handleSignIn)}
            >
              <FormField
                control={form.control}
                name='identifier' // <-- Corrected name to 'identifier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel> {/* <-- Updated label */}
                    <FormControl>
                      <Input
                        placeholder='Enter email or username...' // <-- Updated placeholder
                        type='text' // Use 'text' since it can be either email or username
                        {...field}
                        disabled={isLoading} // <-- Disable during loading
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
                        disabled={isLoading} // <-- Disable during loading
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading}> {/* <-- Disable during loading */}
                {isLoading ? 'Signing in...' : 'Sign in'} {/* <-- Dynamic button text */}
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
        <Link href='/sign-up' className='text-xs text-primary'> {/* <-- Ensure this link is correct for your signup page */}
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SigninPage;