import { ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";
import { Config } from "..";
import { zAuctionConfiguration, ConfigurationParameters } from "./zAuction";

const mainnetRegistrar = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
const mainnetHub = "0x3F0d0a0051D1E600B3f6B35a07ae7A64eD1A10Ca";
const mainnetStaking = "0x45b13d8e6579d5C3FeC14bB9998A3640CD4F008D";
const mainnetBasicController = "0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a";

export const mainnetConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const mainnetConfig: ConfigurationParameters = {
    web3Provider: provider,
    network: "rinkeby",
    znsHubAddress: mainnetHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics.herokuapp.com",
    zAuction: {
      ...zAuctionConfiguration(mainnetConfig),
    },
    basicController: mainnetBasicController,
    registrar: mainnetRegistrar,
    hub: mainnetHub,
    provider: provider,
  };
};

const kovanRegistrar = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
const kovanHub = ethers.constants.AddressZero;
const kovanStaking = "0x1E3F8B31b24EC0E938BE45ecF6971584F90A1602";
const kovanBasicController = "0x2EF34C52138781C901Fe9e50B64d80aA9903f730";

export const kovanConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const kovanConfig: ConfigurationParameters = {
    web3Provider: provider,
    network: "kovan",
    znsHubAddress: kovanHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-kovan",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-kovan.herokuapp.com",
    zAuction: {
      ...zAuctionConfiguration(kovanConfig),
    },
    basicController: kovanBasicController,
    registrar: kovanRegistrar,
    hub: kovanHub,
    provider: provider,
  };
};

const rinkebyRegistrar = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca";
const rinkebyHub = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";
const rinkebyStaking = "0x7FDd24f30fB8a3E0021e85Fdb737a3483D3C8135";
const rinkebyBasicController = "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28";

export const rinkebyConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const rinkebyConfig: ConfigurationParameters = {
    web3Provider: provider,
    network: "rinkeby",
    znsHubAddress: rinkebyHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-rinkeby",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-rinkeby.herokuapp.com",
    zAuction: {
      ...zAuctionConfiguration(rinkebyConfig),
    },
    basicController: rinkebyBasicController,
    registrar: rinkebyRegistrar,
    hub: rinkebyHub,
    provider: provider,
  };
};
