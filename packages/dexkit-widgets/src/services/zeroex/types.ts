export type ZeroExQuote = {
  // Ethereum Address
  sellToken?: string;

  // Ethereum Address
  buyToken?: string;

  // bigNumber
  sellAmount?: string;

  // bigNumber
  buyAmount?: string;

  // 0.03 = 3%
  slippagePercentage: number;

  // bigNumber
  gasPrice?: string;

  // Ethereum Address
  takerAddress?: string;

  skipValidation?: boolean;

  // Ethereum Address
  feeRecipient?: string;

  buyTokenPercentageFee?: number;

  // Ethereum Address
  affiliateAddress: string;

  enableSlippageProtection?: boolean;

  priceImpactProtectionPercentage?: boolean;
};

export type ZeroExQuoteResponse = {
  price: string;
  guaranteedPrice: any;
  estimatedPriceImpact: any;
  to: string;
  data: string;
  value: string;
  gasPrice: string;
  gas: string;
  estimatedGas: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyAmount: string;
  sellAmount: string;
  sources: any;
  buyTokenAddress: string;
  sellTokenAddress: string;
  allowanceTarget: any;
  orders: any;
  sellTokenToEthRate: any;
  buyTokenToEthRate: any;
  expectedSlippage: any;
};
