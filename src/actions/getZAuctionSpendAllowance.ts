import { TokenAllowanceParams } from "../types";
import * as zAuction from "@zero-tech/zauction-sdk";
import { ethers } from "ethers";

type TokenAllowanceFunc<T> = (
  account: string,
  arg: T
) => Promise<ethers.BigNumber>;

const getAllowance = async <T>(
  allowanceFunc: TokenAllowanceFunc<T>,
  account: string,
  arg: T,
  sdk: zAuction.Instance
): Promise<ethers.BigNumber> => {
  let allowance = await allowanceFunc(account, arg);

  if (allowance.eq("0")) {
    allowance = await sdk.getZAuctionLegacySpendAllowance(account);
  }

  return allowance;
};

export const getZauctionSpendAllowance = async (
  account: string,
  params: TokenAllowanceParams,
  sdk: zAuction.Instance
): Promise<ethers.BigNumber> => {
  let allowance: ethers.BigNumber;

  if (params.paymentTokenAddress) {
    allowance = await getAllowance<string>(
      sdk.getZAuctionSpendAllowance,
      account,
      params.paymentTokenAddress,
      sdk
    );
    return allowance;
  }

  if (params.tokenId) {
    allowance = await getAllowance<string>(
      sdk.getZAuctionSpendAllowanceByDomain,
      account,
      params.tokenId,
      sdk
    );
    return allowance;
  }

  if (params.bid) {
    allowance = await getAllowance<zAuction.Bid>(
      sdk.getZAuctionSpendAllowanceByBid,
      account,
      params.bid,
      sdk
    )
    return allowance;
  }

  // If no params are given we can only check the legacy contract allowance
  allowance = await sdk.getZAuctionLegacySpendAllowance(account);

  // If account has never approved this value will be 0
  return allowance;
};
