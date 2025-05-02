import { TwitterApi } from 'twitter-api-v2';
import { decrypt } from './encryption';

export function buildClient(tokens: { accessToken: string; refreshToken?: string; }): TwitterApi {
  return new TwitterApi(tokens.accessToken);
}

export async function fetchBookmarksForUser(tokensEncrypted: string, sinceId?: string) {
  const tokens = JSON.parse(decrypt(tokensEncrypted));
  const client = buildClient(tokens);
  const bookmarks = await client.v2.bookmarks({ since_id: sinceId, max_results: 100 });
  return bookmarks.data ?? [];
}
