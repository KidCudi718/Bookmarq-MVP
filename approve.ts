import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';
import { logToHedera } from '../../../../lib/hedera';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const {id}=req.query;
  if(req.method!=='POST') return res.status(405).end();
  const {data,error}=await supabase.from('bookmarks').update({approved:true}).eq('id',id).select().single();
  if(error) return res.status(500).json({error:error.message});
  await logToHedera(JSON.stringify(data));
  res.json({status:'logged'});
}
