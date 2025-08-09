// app/auth/faceit/route.ts
import { NextRequest } from 'next/server';
import { FaceitVisa } from 'faceit-visa';

const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID!,
  clientSecret: process.env.FACEIT_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL}/auth/faceit/callback`
});

export async function GET() {
  const { url } = visa.getAuthUrl();
  return Response.redirect(url);
}

// app/auth/faceit/callback/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return Response.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  // In a real app, you'd get the code verifier from session/cookies
  const codeVerifier = request.cookies.get('faceit_code_verifier')?.value;
  
  if (!codeVerifier) {
    return Response.json({ error: 'Code verifier not found' }, { status: 400 });
  }

  try {
    const tokenResponse = await visa.exchangeCode(code, codeVerifier);
    if (!tokenResponse) {
      return Response.json({ error: 'Token exchange failed' }, { status: 400 });
    }

    const user = await visa.getUserProfile(tokenResponse.access_token);
    if (!user) {
      return Response.json({ error: 'Failed to get user profile' }, { status: 400 });
    }

    // Store user data in session/JWT
    // This is a simplified example - implement proper session management
    const response = Response.redirect('/dashboard');
    response.cookies.set('faceit_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('FACEIT auth error:', error);
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }
}