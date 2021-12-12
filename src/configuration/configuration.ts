import { ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";

export const zAuctionConfiguration = (
  web3Provider: ethers.providers.Web3Provider,
  apiUri?: string,
  subgraphUri?: string,
  zAuctionAddress?: string,
  tokenContract?: string
): zAuction.Config => {
  let defaultApiUri;
  let defaultSubgraphUri;
  let defaultZAuctionAddress;
  let defaultTokenContract;

  if (!web3Provider)
    throw Error("Invalid provider given");

  if (
    web3Provider.network.name == "mainnet" ||
    web3Provider.network.name == "homestead"
  ) {
    defaultApiUri = "https://mainnet.zauction.api.zero.tech/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction";
    defaultZAuctionAddress = "0x05cBD37cA528B7ea50800aA80ddD0F9F30C952F0";
    defaultTokenContract = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
  } else if (web3Provider.network.name === "kovan") {
    defaultApiUri = "https://zauction-kovan-api.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-kovan";
    defaultZAuctionAddress = "0x18A804a028aAf1F30082E91d2947734961Dd7f89";
    defaultTokenContract = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
  } else {
    throw Error(`Network ${web3Provider.network.name} is not supported`);
  }

  return {
    web3Provider: web3Provider,
    apiUri: apiUri ?? defaultApiUri,
    subgraphUri: subgraphUri ?? defaultSubgraphUri,
    zAuctionAddress: zAuctionAddress ?? defaultZAuctionAddress,
    tokenContract: tokenContract ?? defaultTokenContract,
  } as zAuction.Config;
};
