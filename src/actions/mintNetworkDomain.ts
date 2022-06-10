import { getLogger, Maybe } from "../utilities";
import { ContractTransaction, ethers } from "ethers";
import { DomainPurchaser } from "../contracts/types/DomainPurchaser";

const logger = getLogger("actions:getDomainMetadata");

export const mintNetworkDomain = async (
  name: string,
  metadataUri: string,
  signer: ethers.Signer,
  domainPurchaser: DomainPurchaser,
): Promise<ethers.ContractTransaction> => {
  let tx: Maybe<ethers.ContractTransaction>;
  try {
    tx = await domainPurchaser.connect(signer).purchaseSubdomain(0, name, metadataUri);
  } catch (e) {
    if ((e as any).code === 4001) {
      throw Error(`User rejected transaction.`);
    }
    logger.trace(`Attempt to mint domain failed for domain: ${name} with metadata uri ${metadataUri} for reason ${e}`);
    throw Error(`Failed to submit transaction: ${e}`);
  }
  return tx;
}
