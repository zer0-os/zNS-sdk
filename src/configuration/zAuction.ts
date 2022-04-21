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
  let defaultLegacyZAuctionAddress;

  if (network === "mainnet" || network === "homestead") {
    defaultApiUri = "https://mainnet.zauction.api.zero.tech/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction";
    defaultZAuctionAddress = "0x411973Fa81158A4c7767a0D6F7dF62723fDd541F";
    defaultTokenContract = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
    defaultLegacyZAuctionAddress = "0x05cBD37cA528B7ea50800aA80ddD0F9F30C952F0";
  } else if (network === "kovan") {
    defaultApiUri = "https://zauction-kovan-api.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-kovan";
    defaultZAuctionAddress = "0x646757a5F3C9eEB4C6Bd136fCefE655B4A8107e4";
    defaultTokenContract = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
    defaultLegacyZAuctionAddress = "0x18A804a028aAf1F30082E91d2947734961Dd7f89";
  } else if (network == "rinkeby") {
    defaultApiUri = "https://zauction-api-rinkeby.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-rinkeby";
    defaultZAuctionAddress = "0xb2416Aed6f5439Ffa0eCCAaa2b643f3D9828f86B";
    defaultTokenContract = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca"; // not ERC20 token, technically 721 token
    defaultLegacyZAuctionAddress = "0x376030f58c76ECC288a4fce8F88273905544bC07";
  } else if (network == "goerli") {
    defaultApiUri = "https://zauction-api-goerli.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-goerli";
    defaultZAuctionAddress = "0xdF0f9F007A38aD25E0c02959374f38719Af5fCf8";
    defaultTokenContract = "0x53EF64F91e0d2f4577807f39760d2D266011cd40"; // not ERC20 token, technically 721 token
    defaultLegacyZAuctionAddress = ethers.constants.AddressZero;
  } else {
    throw Error(`Network ${network} is not supported`);
  }

  const config: zAuction.Config = {
    web3Provider: web3Provider as ethers.providers.Web3Provider,
    apiUri: apiUri ?? defaultApiUri,
    subgraphUri: subgraphUri ?? defaultSubgraphUri,
    zAuctionAddress: zAuctionAddress ?? defaultZAuctionAddress,
    tokenContract: tokenContract ?? defaultTokenContract,
    zAuctionLegacyAddress: "",
  };

  return config;
};
