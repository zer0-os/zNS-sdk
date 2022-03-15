import { ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";

export const zAuctionConfiguration = (
  web3Provider: ethers.providers.Provider,
  network: string,
  apiUri?: string,
  subgraphUri?: string,
  zAuctionAddress?: string,
  tokenContract?: string
): zAuction.Config => {
  let defaultApiUri;
  let defaultSubgraphUri;
  let defaultZAuctionAddress;
  let defaultTokenContract;

  if (network === "mainnet" || network === "homestead") {
    defaultApiUri = "https://mainnet.zauction.api.zero.tech/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction";
    defaultZAuctionAddress = "0x1ee3F16aa8081891CfcfAB59d0DBFe03f2B77ff6";
    defaultTokenContract = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
  } else if (network === "kovan") {
    defaultApiUri = "https://zauction-kovan-api.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-kovan";
    defaultZAuctionAddress = "0x646757a5F3C9eEB4C6Bd136fCefE655B4A8107e4";
    defaultTokenContract = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
  } else if (network == "rinkeby") {
    defaultApiUri = "https://zauction-api-rinkeby.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-rinkeby";
    defaultZAuctionAddress = "0xb2416Aed6f5439Ffa0eCCAaa2b643f3D9828f86B";
    defaultTokenContract = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca"; // not ERC20 token, technically 721 token
  } else {
    throw Error(`Network ${network} is not supported`);
  }

  return {
    web3Provider: web3Provider,
    apiUri: apiUri ?? defaultApiUri,
    subgraphUri: subgraphUri ?? defaultSubgraphUri,
    zAuctionAddress: zAuctionAddress ?? defaultZAuctionAddress,
    tokenContract: tokenContract ?? defaultTokenContract,
  } as zAuction.Config;
};
