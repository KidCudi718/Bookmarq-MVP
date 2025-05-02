import { Client, TopicMessageSubmitTransaction } from '@hashgraph/sdk';

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID!, process.env.HEDERA_PRIVATE_KEY!);

export async function logToHedera(message: string) {
  const tx = await new TopicMessageSubmitTransaction({
    topicId: process.env.HEDERA_TOPIC_ID!,
    message,
  }).execute(client);
  return tx.transactionId.toString();
}
