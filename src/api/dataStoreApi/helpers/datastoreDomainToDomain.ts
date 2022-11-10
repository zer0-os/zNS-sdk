import { ethers } from "ethers";
import { Domain, Maybe } from "../../../types";
import { BuyNowPriceListing, DataStoreDomain } from "../types";

export function datastoreDomainToDomain(d: DataStoreDomain): Domain {
  // only show an active listing
  const buyNow: Maybe<BuyNowPriceListing> = d.buyNow.isActive
    ? d.buyNow.listing
    : undefined;

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
    buyNow: buyNow,
  };
  return domain;
}
