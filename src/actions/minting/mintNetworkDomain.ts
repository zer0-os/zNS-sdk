import { getLogger, Maybe } from "../../utilities";
import { ContractTransaction, ethers } from "ethers";
import { NetworkDomainMintableConfig } from "../../types";
import { isNetworkDomainAvailable } from "./isNetworkDomainAvailable";
import { getPriceOfNetworkDomain } from "../getPriceOfNetworkDomain";
import { isMinterApprovedToSpendTokens } from ".";
import { getERC20Contract } from "../../contracts";

const logger = getLogger("actions:getDomainMetadata");

export const mintNetworkDomain = async (
  name: string,
  config: NetworkDomainMintableConfig,
  metadataUri: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  let tx: Maybe<ethers.ContractTransaction>;
  const price = await getPriceOfNetworkDomain(
    name,
    config.domainPurchaser.domainPurchaser
  );
  const user = await signer.getAddress();

  if (
    !(await isMinterApprovedToSpendTokens(user, config.domainPurchaser, price))
  ) {
    throw Error(`${user} is not approved to spend ${price}`);
  }

  //Verify purchaser has correct amount of tokens
  const tokenAddress =
    await config.domainPurchaser.domainPurchaser.paymentToken();
  const paymentToken = await getERC20Contract(
    config.domainPurchaser.provider,
    tokenAddress
  );
  const balance = await paymentToken.balanceOf(user);
  if (balance.lt(ethers.utils.parseEther(price))) {
    throw Error(`${user} does not have required balance of ${price}`);
  }

  if (
    !(await isNetworkDomainAvailable(
      name,
      config.znsHub,
      config.services.apiClient
    ))
  ) {
    throw Error("The requested network domain is not available.");
  }

  try {
    //Purchase network domain
    tx = await config.domainPurchaser.domainPurchaser
      .connect(signer)
      .purchaseSubdomain(0, name, metadataUri);
  } catch (e) {
    logger.trace(
      `Attempt to mint domain failed for domain: ${name} with metadata uri ${metadataUri} for reason ${e}`
    );
    if ((e as any).code === 4001) {
      throw Error(`User rejected transaction.`);
    }
    throw Error(`Failed to submit transaction: ${e}`);
  }
  return tx;
};
