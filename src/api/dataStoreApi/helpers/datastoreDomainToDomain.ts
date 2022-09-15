import { ethers } from "ethers";
import { Domain } from "../../../types";
import { DataStoreDomain } from "../types";

export function datastoreDomainToDomain(d: DataStoreDomain): Domain {
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
        buyNow: d.buyNow.activeListing
      };
      return domain;

}