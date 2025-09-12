import * as z from 'zod';

// Define the schema for credentials, can be imported from your component
const formSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

type SignInCredentials = z.infer<typeof formSchema>;

/**
 * Calls the internal Next.js login API route to authenticate the user.
 * The token is never handled on the client.
 * @param credentials - The user's username and password.
 */
export const signInUser = async (credentials: SignInCredentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.identifier,
      password: credentials.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Sign-in failed.');
  }

  return data;
};