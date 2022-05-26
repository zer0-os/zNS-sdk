import { TokenAllowanceParams } from "../types";
import * as zAuction from "@zero-tech/zauction-sdk";
import { ethers } from "ethers";

import { getLogger } from "../utilities";

const logger = getLogger("actions:getZAuctionSpendAllowance");

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
  logger.trace(`Getting allowance for user ${account}`);

  if (params.paymentTokenAddress) {
    logger.trace(
      `Getting by paymentTokenAddress ${params.paymentTokenAddress}`
    );
    allowance = await getAllowance<string>(
      sdk.getZAuctionSpendAllowance,
      account,
      params.paymentTokenAddress,
      sdk
    );
    logger.trace(`User has allowance ${allowance.toString()}`);
    return allowance;
  }

  if (params.tokenId) {
    logger.trace(`Getting by tokenId ${params.tokenId}`);
    allowance = await getAllowance<string>(
      sdk.getZAuctionSpendAllowanceByDomain,
      account,
      params.tokenId,
      sdk
    );
    logger.trace(`User has allowance ${allowance.toString()}`);
    return allowance;
  }

  if (params.bid) {
    logger.trace(`Getting by bid ${params.bid}`);
    allowance = await getAllowance<zAuction.Bid>(
      sdk.getZAuctionSpendAllowanceByBid,
      account,
      params.bid,
      sdk
    );
    logger.trace(`User has allowance ${allowance.toString()}`);
    return allowance;
  }

  logger.trace(`Falling back to checking legacy zAuction allowance`);

  // If no params are given we can only check the legacy contract allowance
  allowance = await sdk.getZAuctionLegacySpendAllowance(account);

  logger.trace(`User has allowance ${allowance}`);
  // If account has never approved this value will be 0
  return allowance;
};
