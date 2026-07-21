import * as z from 'zod';

// You can define this once and import it in both places
const formSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  acceptTerms: z.boolean(),
});

type SignUpCredentials = z.infer<typeof formSchema>;

/**
 * Calls the internal Next.js register API route.
 * @param credentials - The new user's details from the form.
 */
export const signUpUser = async (credentials: SignUpCredentials) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Sign-up failed.');
  }

  return data;
};