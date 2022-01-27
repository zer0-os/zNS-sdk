import { ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";
import { Config } from "..";
import { zAuctionConfiguration } from "./configuration";
import { zAuctionRoute } from "../types";

const mainnetRegistrar = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
const mainnetStaking = "0x45b13d8e6579d5C3FeC14bB9998A3640CD4F008D";

export const mainnetConfiguration = (
  provider: ethers.providers.Web3Provider
): Config => {
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics.herokuapp.com",
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        // Use default values
        config: zAuctionConfiguration(provider, "mainnet") as zAuction.Config,
      } as zAuctionRoute,
    ],
    basicController: "0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a",
    registrar: mainnetRegistrar,
  };
};

const kovanRegistrar = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
const kovanStaking = "0x1E3F8B31b24EC0E938BE45ecF6971584F90A1602";

export const kovanConfiguration = (
  provider: ethers.providers.Web3Provider
): Config => {
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-kovan",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-kovan.herokuapp.com",
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        // Use default values
        config: zAuctionConfiguration(provider, "kovan") as zAuction.Config,
      } as zAuctionRoute,
    ],
    basicController: "0x2EF34C52138781C901Fe9e50B64d80aA9903f730",
    registrar: kovanRegistrar,
  };
};

export const rinkebyConfiguration = (
  provider: ethers.providers.Web3Provider
): Config => {
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-rinkeby",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-kovan.herokuapp.com", // todo
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        // Use default values
        config: zAuctionConfiguration(provider, "rinkeby") as zAuction.Config,
      } as zAuctionRoute,
    ],
    basicController: "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28",
    registrar: kovanRegistrar,
  };
};
