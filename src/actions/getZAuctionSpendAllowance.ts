import { zAuctionConfig } from "../configuration/zAuction";
import { TokenAllowanceParams } from "../types";
import * as zAuction from "@zero-tech/zauction-sdk";
import { ethers } from "ethers";

export const getZauctionSpendAllowance = async (
  params: TokenAllowanceParams,
  account: string,
  sdk: zAuction.Instance
): Promise<ethers.BigNumber> => {
  let allowance: ethers.BigNumber;
  if (params.paymentTokenAddress) {
    allowance = await sdk.getZAuctionSpendAllowance(
      params.paymentTokenAddress,
      account
    );
    return allowance;
  }
  if (params.tokenId) {
    allowance = await sdk.getZAuctionSpendAllowanceByDomain(
      account,
      params.tokenId
    );
    return allowance;
  }
  if (params.bid) {
    allowance = await sdk.getZAuctionSpendAllowanceByBid(account, params.bid);
    return allowance;
  }

  allowance = await sdk.getZAuctionLegacySpendAllowance(account);

  // If account has never approved this value will be 0
  return allowance;
};
