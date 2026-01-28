// src/lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'; // <--- Import this\

export async function getAuthToken() {
  const cookieStore = await cookies(); 
  let token = cookieStore.get('authToken')?.value;

  // DEBUG 1: Did we find it?
  if (!token) {
    console.log("❌ [Auth] getAuthToken: Cookie 'authToken' is MISSING on server.");
    return undefined;
  }

  // DEBUG 2: Check for accidental quotes (common issue)
  if (token.startsWith('"') && token.endsWith('"')) {
    console.log("⚠️ [Auth] Cleaning quotes from token.");
    token = token.slice(1, -1);
  }

  // console.log("✅ [Auth] Token found:", token.substring(0, 5) + "...");
  return token;
}

export const getAuthenticatedHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken();

  if (!token) {
    console.error("⛔ [Auth] Headers generation failed: No token.");
    // THROWING ERROR ensures we don't send a 'naked' request to Django
    redirect('/sign-in'); 
  }

  // DEBUG 3: Confirm the prefix
  const authValue = `Token ${token}`;
  console.log(`🔐 [Auth] Generating Header: 'Authorization': '${authValue.substring(0, 15)}...'`);

  return {
    'Authorization': authValue, // MUST use 'Token', not 'Bearer'
    'Content-Type': 'application/json',
  };
};