import { Client, TopicMessageSubmitTransaction, PrivateKey } from '@hashgraph/sdk';

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID as string, PrivateKey.fromStringED25519(process.env.HEDERA_PRIVATE_KEY_HEX as string));

export async function logToHedera(message:string){
  const tx = new TopicMessageSubmitTransaction()
    .setTopicId('0.0.123456') // replace with real topic
    .setMessage(message);
  await tx.execute(client);
}
