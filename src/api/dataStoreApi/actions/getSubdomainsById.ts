import { Maybe } from "../../../utilities";
import { Domain } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string,
  header: Record<string, string>
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;

  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}domains/subdomains/${tokenId}`,
      "POST",
      undefined,
      header
    );
  } catch (e) {
    throw Error(`Failed to get subdomains for ${tokenId}: ${e}`);
  }

  // Map from DataStoreDomain -> Domain for downstream consistency
  const domains: Domain[] = response.result.map((d) => {
    const domain: Domain = {
      id: d.domainId,
      name: d.name,
      parentId: d.parent,
      owner: d.owner.value,
      minter: d.minter,
      metadataUri: d.metadataUri.value,
      isLocked: d.locked ? d.locked.value : false,
      lockedBy: d.lockedBy ? d.lockedBy.value : ethers.constants.AddressZero,
      contract: d.registrar,
      isRoot: d.domainId === ethers.constants.HashZero,
    };
    return domain;
  });

  return domains;
};
