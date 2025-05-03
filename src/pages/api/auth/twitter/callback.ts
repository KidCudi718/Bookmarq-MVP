// src/pages/api/auth/callback.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Optionally, you can log or inspect the query if needed:
  console.log('OAuth callback query:', req.query);

  // Redirect to homepage (or dashboard) after login
  res.redirect('/');
}