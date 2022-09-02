import { Domain, Maybe } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}v1/domains/subdomains/${tokenId}?projection=false&limit=0`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get subdomains for ${tokenId}: ${e}`);
  }

 // Map from DataStoreDomain -> Domain for downstream consistency
 const domains: Domain[] = response.results.map((d) => {
  const domain: Domain = {
    id: d.domainId.toLowerCase(),
    name: d.name,
    parentId: d.parent.toLowerCase(),
    owner: d.owner.toLowerCase(),
    minter: d.minter.toLowerCase(),
    metadataUri: d.metadataUri,
    isLocked: d.locked,
    lockedBy: d.lockedBy
      ? d.lockedBy.toLowerCase()
      : ethers.constants.AddressZero,
    contract: d.registrar.toLowerCase(),
    isRoot: d.isRoot,
  };
  return domain;
});

  return domains;
};
