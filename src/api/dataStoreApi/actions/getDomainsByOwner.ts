import { Domain, Maybe } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";
import { sortDomains } from "../../../helpers";

export const getDomainsByOwner = async (
  apiUri: string,
  ownerAddress: string
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  try {
    // Set limit up to 1000 to match the subgraph maximum
    response = await makeApiCall<DomainCollection>(
      `${apiUri}v1/domains/search/owner/${ownerAddress}?projection=false&limit=1000`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get domains for owner ${ownerAddress}: ${e}`);
  }

  // Map from DataStoreDomain -> Domain for downstream consistency
  const domains: Domain[] = response.results.map((d) => {
    const domain: Domain = {
      id: d.domainId.toLowerCase(),
      name: d.name,
      parentId: d.parent.toLowerCase(),
      owner: d.owner.value.toLowerCase(),
      minter: d.minter.toLowerCase(),
      metadataUri: d.metadataUri.value,
      isLocked: d.locked ? d.locked.value : false,
      lockedBy: d.lockedBy
        ? d.lockedBy.value.toLowerCase()
        : ethers.constants.AddressZero,
      contract: d.registrar.toLowerCase(),
      isRoot: d.isRoot,
    };
    return domain;
  });

  // Will sort in ascending ASCII order
  sortDomains(domains);

  return domains;
};
