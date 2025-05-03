import { Client, TransferTransaction, Hbar, TransactionId, TransactionReceipt } from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

const accountId = process.env.HEDERA_ACCOUNT_ID ?? '0.0.5864774';
const privateKey = process.env.HEDERA_PRIVATE_KEY ?? '0x5f437b2c6770fa5f839ba2c34d9610c9e2025df6727c1069a42d5bbb110ce60d';

if (!accountId || !privateKey) {
  throw new Error('Hedera credentials missing in .env');
}

const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

export async function logBookmarkToHedera(bookmarkId: string): Promise<string> {
  try {
    const transaction = new TransferTransaction()
      .addHbarTransfer(accountId, new Hbar(-0.01))
      .addHbarTransfer(accountId, new Hbar(0.01))
      .setTransactionMemo(`Bookmark Saved: ${bookmarkId}`);

    // Execute the transaction and get the TransactionId
    const txId = await transaction.execute(client); // Remove explicit type to let TypeScript infer
    const receipt: TransactionReceipt = await txId.getReceipt(client);

    console.log(`Hedera Transaction Status: ${receipt.status.toString()}`);
    return txId.toString();
  } catch (error: unknown) {
    console.error('Hedera Error:', error);
    throw error instanceof Error ? error : new Error('Unknown Hedera error');
  }
}
