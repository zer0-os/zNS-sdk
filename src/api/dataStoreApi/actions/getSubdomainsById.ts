import { Domain, Maybe } from "../../../types";
import { DomainCollection, RequestBody } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}/v1/domains/subdomains/${tokenId}?projection=false`,
      "GET",
    );
  } catch (e) {
    throw Error(`Failed to get subdomains for ${tokenId}: ${e}`);
  }

  // Map from DataStoreDomain -> Domain for downstream consistency
  const domains: Domain[] = response.results.map((d) => {
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
      isRoot: d.isRoot,
    };
    return domain;
  });

  return domains;
};
