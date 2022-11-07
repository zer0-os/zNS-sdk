import { BigNumber, ethers } from "ethers";
import { IERC20 } from "../../contracts/types";

export const getTokenSpendAllowance = async (
  token: IERC20,
  minter: string,
  user: string
): Promise<BigNumber> => {
  const allowance = await token.allowance(user, minter);
  return allowance;
};
