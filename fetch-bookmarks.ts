import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';
import { OpenAI } from 'openai';
import { supabase } from '../../../lib/supabase';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const twitter = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string);
    const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    // this example pulls last 5 bookmarks for user hard‑coded id (you'd use auth)
    const {data:bookmarks}= await twitter.v2.userBookmarkTimeline('123', {max_results:5});
    for(const tweet of bookmarks.data){
      const prompt = `Classify this tweet and draft an action:\n${tweet.text}\nReturn JSON {"category":"","draft":""}`;
      const chat = await openai.chat.completions.create({model:'gpt-3.5-turbo',messages:[{role:'user',content:prompt}]});
      const json = JSON.parse(chat.choices[0].message.content||'{}');
      await supabase.from('bookmarks').insert({tweet_url:`https://twitter.com/i/web/status/${tweet.id}`,category:json.category,draft:json.draft});
    }
    res.json({imported: bookmarks.data.length});
  }catch(e:any){
    console.error(e);
    res.status(500).json({error:e.message});
  }
}
