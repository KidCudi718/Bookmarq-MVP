import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';
import { supabase } from '@/lib/supabase';

const handleTwitterLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
  });
  if (error) console.error('Twitter login error:', error.message);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
    { scope: ['tweet.read', 'users.read', 'bookmark.read'] }
  );
  // store codeVerifier and state in cookie
  res.setHeader('Set-Cookie', [
    `codeVerifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    `oauthState=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  ]);
  res.redirect(url);
}
