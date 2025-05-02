import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';
import { supabaseService } from '@/lib/supabase';
import { encrypt } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state, code } = req.query;
  const storedState = req.cookies.oauthState;
  const codeVerifier = req.cookies.codeVerifier;

  if (state !== storedState) return res.status(400).send('Invalid state');

  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });
  const { client: loggedClient, accessToken, refreshToken } = await client.loginWithOAuth2({
    code: code as string,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
    codeVerifier,
  });
  const tokensEncrypted = encrypt(JSON.stringify({ accessToken, refreshToken }));
  const me = await loggedClient.v2.me();
  await supabaseService.from('profiles').upsert({
    id: me.data.id,
    twitter_handle: me.data.username,
    twitter_tokens_encrypted: tokensEncrypted,
  });
  res.redirect('/'); // back to dashboard
}
