export const namespace = 'default';
export const taskQueueName = 'money-transfer';

export type PaymentDetails = {
  amount: number;
  sourceAccount: string;
  targetAccount: string;
  referenceId: string;
};
