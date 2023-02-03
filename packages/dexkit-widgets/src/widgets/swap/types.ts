import { BigNumber } from "ethers";
import React from "react";
import { ZeroExQuoteResponse } from "../../services/zeroex/types";
import { Token } from "../../types";

export type Empty = {
  name: string;
};

export type SwapSide = "sell" | "buy";
export type ExecType = "swap" | "wrap" | "unwrap" | "approve" | "quote";

export type SwapState = {
  buyToken: Token | undefined;
  sellToken: Token | undefined;
  showSelect: boolean;
  selectSide: SwapSide | undefined;
  sellAmount: BigNumber;
  buyAmount: BigNumber;
  quoteFor?: SwapSide;
  execType?: ExecType;
  isExecuting: boolean;
  quote?: ZeroExQuoteResponse | null;
  sellTokenBalance?: BigNumber;
  buyTokenBalance?: BigNumber;
  insufficientBalance: boolean;
  handleConnectWallet: () => void;
  handleOpenSelectToken: (
    selectFor: SwapSide,
    token?: Token | undefined
  ) => void;
  handleSelectToken: (token: Token) => void;
  setBuyToken: React.Dispatch<Token | undefined>;
  setQuoteFor: React.Dispatch<SwapSide | undefined>;
  setSellToken: React.Dispatch<Token | undefined>;
  setBuyAmount: React.Dispatch<BigNumber>;
  setSellAmount: React.Dispatch<BigNumber>;
  handleChangeSellAmount: (value: BigNumber) => void;
  handleChangeBuyAmount: (value: BigNumber) => void;
  handleSwapTokens: () => void;
  handleExecSwap: () => void;
};
