'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // Import useState

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod'; // Zod is already imported

import ngaIconH from '/public/logo-h.svg';
import { FcGoogle } from 'react-icons/fc';

import axios from 'axios'; // Import axios

// --- Configuration ---
const API_BASE_URL = 'http://localhost:8000/api';
// --- End Configuration ---

// --- Zod Schema (as defined above) ---
const formSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username cannot exceed 50 characters.'),
  
  email: z.string().email('Please enter a valid email address.'),
  
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .refine((password) => {
      return /^(?=.*[!@#$%^&*])(?=.*[A-Z]).*$/.test(password);
    }, 'The password must contain at least 1 uppercase letter and 1 special character'),
  
  acceptTerms: z
    .boolean({
      required_error:
        'To be able to sign up, you must accept the terms and conditions',
    })
    .refine(
      (checked) => checked,
      'To be able to sign up, you must accept the terms and conditions'
    ),
});
// --- End Zod Schema ---


const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '', // NEW default value
      email: '',    // Changed from 'identifier' to 'email'
      password: '',
      acceptTerms: false,
    },
  });

  const handleSignUp = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // --- Step 1: Register the new user with Django API ---
      // Send both username and email to the registration endpoint
      const registerResponse = await axios.post(`${API_BASE_URL}/register/`, {
        username: data.username, // Send the username
        email: data.email,       // Send the email
        password: data.password,
      });

      console.log('User registered successfully:', registerResponse.data);

      // --- Step 2: Log in the newly registered user to get an authentication token ---
      // For login, typically you'd use the username (or email if your custom view handles it)
      const loginResponse = await axios.post(`${API_BASE_URL}/api-token-auth/`, {
        username: data.username, // Use the username for login
        password: data.password,
      });

      const { token } = loginResponse.data;
      localStorage.setItem('authToken', token);
      console.log('Login successful, token obtained:', token);

      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up failed:', error);
      let errorMessage = 'An unexpected error occurred during sign up.';

      if (axios.isAxiosError(error) && error.response) {
        const apiErrorData = error.response.data;
        console.error("Django API Error Details:", apiErrorData); // Log full error from Django

        if (error.response.status === 400) {
          // Handle specific validation errors for username and email
          if (apiErrorData.username) {
            errorMessage = `Username: ${apiErrorData.username.join(', ')}`;
          } else if (apiErrorData.email) {
            errorMessage = `Email: ${apiErrorData.email.join(', ')}`;
          } else if (apiErrorData.password) {
            errorMessage = `Password: ${apiErrorData.password.join(', ')}`;
          } else if (apiErrorData.non_field_errors) {
            errorMessage = `${apiErrorData.non_field_errors.join(', ')}`;
          } else if (typeof apiErrorData === 'string') {
            errorMessage = apiErrorData;
          } else {
            errorMessage = JSON.stringify(apiErrorData);
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please try logging in manually.';
        } else {
          errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
          if (apiErrorData.detail) {
            errorMessage = apiErrorData.detail;
          }
        }
      } else {
        errorMessage = error.message;
      }

      console.error(`Sign up failed: ${errorMessage}`);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Card className='w-full max-w-xl py-10 px-14'>
        <CardHeader className='flex flex-col justify-center items-center gap-6'>
          <Image src={ngaIconH} alt='NGA healtcare icon' width={200} />
          <CardTitle className='text-2xl font-semibold'>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className='flex flex-col gap-8'
              onSubmit={form.handleSubmit(handleSignUp)}
            >
              {/* NEW: Username Field */}
              <FormField
                control={form.control}
                name='username' // Field name from your Zod schema
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Choose a username...'
                        type='text'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Updated: Email Field (formerly 'identifier') */}
              <FormField
                control={form.control}
                name='email' // Field name from your Zod schema
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter email address...'
                        type='email' // Use 'email' type for browser validation
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

              <FormField
                control={form.control}
                name='acceptTerms'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-center'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel>I accept the terms and conditions</FormLabel>
                    </div>
                    <FormDescription>
                      By signing up you agree to our{' '}
                      <Link href='/terms'>terms and conditions</Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Signing up...' : 'Sign up'}
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
              Sign up with Google
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div className='flex gap-2 justify-center items-center mt-8'>
        <small>Already have an account?</small>
        <Link href='/login' className='text-xs text-primary'>
          Login
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;