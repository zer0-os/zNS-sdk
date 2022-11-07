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

  const minimumAmount = ethers.BigNumber.from(amount);  
  const approved = allowance.gte(minimumAmount);

  logger.trace(
    `User ${user} spend of ${paymentToken} for domain purchase is: ${approved}`
  );

  return approved;
};
