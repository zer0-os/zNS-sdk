import * as zAuction from "@zero-tech/zauction-sdk";
import { ethers } from "ethers";
import { Config } from ".";
import { zAuctionRoute } from "./types";

const mainnetRegistrar = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
const mainnetStaking = "0x45b13d8e6579d5C3FeC14bB9998A3640CD4F008D";

export const mainnetConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns",
    apiUri: "https://zns.api.zero.tech/api",
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        instance: zAuction.createInstance({
          apiUri: "https://mainnet.zauction.api.zero.tech/api",
          subgraphUri:
            "https://api.thegraph.com/subgraphs/name/zer0-os/zauction",
          zAuctionAddress: "0x05cBD37cA528B7ea50800aA80ddD0F9F30C952F0",
          tokenContract: mainnetRegistrar,
          web3Provider: provider,
        } as zAuction.Config),
      } as zAuctionRoute,
    ],
    basicController: "0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a",
  };
};

const kovanRegistrar = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
const kovanStaking = "0x1E3F8B31b24EC0E938BE45ecF6971584F90A1602";

export const kovanConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-kovan",
    apiUri: "https://zns.api.zero.tech/api",
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        instance: zAuction.createInstance({
            apiUri: "https://zauction-kovan-api.herokuapp.com/api",
            subgraphUri:
              "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-kovan",
            zAuctionAddress: "0x18A804a028aAf1F30082E91d2947734961Dd7f89",
            tokenContract: kovanRegistrar,
            web3Provider: provider,
          } as zAuction.Config)
      } as zAuctionRoute,
    ],
    basicController: "0x2EF34C52138781C901Fe9e50B64d80aA9903f730",
  };
};
