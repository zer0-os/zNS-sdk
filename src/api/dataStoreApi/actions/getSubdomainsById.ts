import { Maybe } from "../../../utilities";
import { Domain } from "../../../types";
import { DomainCollection, RequestBody } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string,
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  const body: RequestBody = {
    options: {
      projection: {
        _id: 0,
      },
    },
  };
  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}domains/subdomains/${tokenId}`,
      "POST",
      JSON.stringify(body)
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
      isRoot: d.isRoot,
    };
    return domain;
  });

  return domains;
};
