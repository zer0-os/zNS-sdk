import { ethers } from "ethers";
import { getERC20Contract } from "../../contracts";
import { DomainPurchaser } from "../../contracts/types/DomainPurchaser";
import { getTokenSpendAllowance } from "./getTokenSpendAllowance";
import { getLogger } from "../../utilities";

const logger = getLogger("actions:isMinterApprovedToSpendToken");

export const isMinterApprovedToSpendTokens = async (
  user: string,
  purchaser: DomainPurchaser,
  amount = Math.pow(10, 10).toString() // Default to 10^10 if user doesn't provide a value
): Promise<boolean> => {
  const tokenAddress = await purchaser.paymentToken();
  const paymentToken = await getERC20Contract(purchaser.provider, tokenAddress);
  const allowance = await getTokenSpendAllowance(
    paymentToken,
    purchaser.address,
    user
  );

  const requiredAmount = ethers.utils.parseEther(amount);
  const allowanceAsNumber = ethers.utils.parseEther(allowance);
  const approved = allowanceAsNumber.gte(requiredAmount);
  logger.trace(
    `User ${user} approval to spend ${requiredAmount} of token ${paymentToken} is: ${approved}`
  );

  return approved;
};
