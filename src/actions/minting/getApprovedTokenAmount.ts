import { ethers } from "ethers";
import { IERC20 } from "../../contracts/types";

export const getTokenSpendAllowance = async (
  token: IERC20,
  minter: string,
  user: string
): Promise<string> => {
  const allowance = await token.allowance(user, minter);
  return ethers.utils.formatEther(allowance);
};
