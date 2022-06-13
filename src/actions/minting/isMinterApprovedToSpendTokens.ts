import { BigNumber, ethers } from "ethers";
import { getERC20Contract } from "../../contracts";
import { getApprovedSpendTokenAmount } from "./getApprovedTokenAmount";
import { DomainPurchaserConfig } from "./types";

export const isMinterApprovedToSpendTokens = async (
  user: string,
  purchaser: DomainPurchaserConfig,
  required?: string
): Promise<boolean> => {
  const tokenAddress = await purchaser.domainPurchaser.paymentToken();
  const paymentToken = await getERC20Contract(purchaser.provider, tokenAddress);
  const allowance = await getApprovedSpendTokenAmount(
    paymentToken,
    purchaser.contractAddress,
    user
  );

  if (!required) {
    // Default to 10^10 if user doesn't provide a value
    required = Math.pow(10, 10).toString();
  }

  const requiredAmount = ethers.utils.parseEther(required);
  const allowanceAsNumber = ethers.utils.parseEther(allowance);
  const approved = allowanceAsNumber.gte(requiredAmount);

  return approved;
};
