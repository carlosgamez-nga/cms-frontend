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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import ngaIconH from '/public/logo-h.svg';
import { signUpUser } from '@/features/auth/queries/sign-up-user';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(50, 'Username cannot exceed 50 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must contain at least 8 characters').refine((password) => /^(?=.*[!@#$%^&*])(?=.*[A-Z]).*$/.test(password), 'Password must contain at least 1 uppercase letter and 1 special character'),
  acceptTerms: z.boolean().refine((checked) => checked, 'You must accept the terms and conditions to sign up'),
});

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '', password: '', acceptTerms: false },
  });

  const handleSignUp = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signUpUser(data);
      toast.success('Account created successfully!');
      window.location.href = '/dashboard'; // Full reload to refresh server state
    } catch (error: any) {
      console.error('Sign up failed:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
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
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Choose a username...' type='text' {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter email address...' type='email' {...field} disabled={isLoading} />
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
                      <PasswordInput placeholder='Enter password...' {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- THIS IS THE CORRECTED FIELD --- */}
              <FormField
                control={form.control}
                name='acceptTerms'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        I accept the terms and conditions
                      </FormLabel>
                      <FormDescription>
                        By signing up you agree to our{' '}
                        <Link href='/terms' className='text-primary hover:underline'>
                          terms and conditions
                        </Link>
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* --- END OF FIX --- */}

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
          <Button className='w-full' asChild variant='secondary' disabled={isLoading}>
            <Link href='/'>
              <FcGoogle />
              Sign up with Google
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div className='flex gap-2 justify-center items-center mt-8'>
        <small>Already have an account?</small>
        <Link href='/sign-in' className='text-xs text-primary'>
          Login
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;