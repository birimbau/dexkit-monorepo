export type CreditGrant = {
  id: number;
  createdAt: string;
  updatedAt: string;

  amount: string;
  account: string;
  expiresIn?: string;
  enabled: boolean;
};
