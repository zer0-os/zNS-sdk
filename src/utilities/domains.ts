import { ethers } from "ethers";

const getSubnodeHash = (parentHash: string, labelHash: string): string => {
  const calculatedHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32"],
      [ethers.utils.arrayify(parentHash), ethers.utils.arrayify(labelHash)]
    )
  );

  return calculatedHash;
};

export const domainNameToId = (name: string): string => {
  let hashReturn = ethers.constants.HashZero;

  if (name === "" || undefined || null) {
    return hashReturn;
  }

  const domains = name.split(".");
  for (let i = 0; i < domains.length; i++) {
    hashReturn = getSubnodeHash(hashReturn, ethers.utils.id(domains[i]));
  }
  return hashReturn;
};

export const getRelativeDomainPath = (
  rootDomain: string,
  domain: string
): string => {
  const fixedPath = domain.replace(`${rootDomain}.`, "");
  return fixedPath;
};

export const getAbsoluteDomainPath = (
  rootDomain: string,
  domain: string
): string => {
  const fixedPath = `${rootDomain}.${domain}`;
  return fixedPath;
};
