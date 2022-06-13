import { getLogger, Maybe } from "../../utilities";
import { ContractTransaction, ethers } from "ethers";
import { isNetworkDomainAvailable } from "./isNetworkDomainAvailable";
import { getPriceOfNetworkDomain } from "../getPriceOfNetworkDomain";
import { isMinterApprovedToSpendTokens } from ".";
import { getDomainPurchaserContract, getERC20Contract } from "../../contracts";
import { NetworkDomainMintableConfig } from "./types";
import { DomainPurchaser } from "../../contracts/types/DomainPurchaser";

const logger = getLogger("actions:getDomainMetadata");

export const mintNetworkDomain = async (
  name: string,
  config: NetworkDomainMintableConfig,
  metadataUri: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  let tx: Maybe<ethers.ContractTransaction>;
  const domainPurchaserContract = await getDomainPurchaserContract(
    config.domainPurchaser.provider,
    config.domainPurchaser.contractAddress
  );
  const price = await getPriceOfNetworkDomain(name, domainPurchaserContract);
  const user = await signer.getAddress();
  const approved = await isMinterApprovedToSpendTokens(
    user,
    domainPurchaserContract,
    price
  );
  if (!approved) {
    logger.debug(`${user} is not approved to spend ${price}`);
    throw Error(`User has not approved contract to spend ZERO tokens.`);
  }

  //Verify purchaser has correct amount of tokens
  const tokenAddress = await domainPurchaserContract.paymentToken();
  const paymentToken = await getERC20Contract(
    config.domainPurchaser.provider,
    tokenAddress
  );
  const balance = await paymentToken.balanceOf(user);
  if (balance.lt(ethers.utils.parseEther(price))) {
    logger.debug(`${user} does not have required balance of ${price}`);
    throw Error(`User does not have enough ZERO tokens.`);
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
    tx = await domainPurchaserContract
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
