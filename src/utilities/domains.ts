import { ethers } from "ethers";
import { TokenAddressMapping } from "../types";

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

// ID must be the given ID from CoinGecko API.
// You can get this value from a token's page under "API ID"
// https://www.coingecko.com/en/coins/zero-tech
export const tokenAddressToFriendlyName: TokenAddressMapping = {
  "mainnet": {
    "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34": {
      id: "wilder-world",
      name: "WILD"
    },
    "0x0ec78ed49c2d27b315d462d43b5bab94d2c79bf8": {
      id: "zero-tech",
      name: "ZERO"
    }
  },
  "rinkeby": {
    "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79": {
      id: "wilder-world",
      name: "WILD"
    },
    "0x5bAbCA2Af93A9887C86161083b8A90160DA068f2": {
      id: "zero-tech",
      name: "ZERO"
    }
  }
}