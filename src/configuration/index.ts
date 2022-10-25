/* eslint-disable */
import { ethers } from "ethers";
import { Config } from "..";
import { configuration, zAuctionConfig } from "./zAuction";

const mainnetRegistrar = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
const mainnetHub = "0x3F0d0a0051D1E600B3f6B35a07ae7A64eD1A10Ca";
const mainnetStaking = "0x45b13d8e6579d5C3FeC14bB9998A3640CD4F008D";
const mainnetBasicController = "0xa05Ae774Da859943B7B859cd2A6aD9F5f1651d6a";
const mainnetDomainPurchaser = ethers.constants.AddressZero;

export const mainnetConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const mainnetConfig: zAuctionConfig = {
    web3Provider: provider,
    network: "mainnet",
    znsHubAddress: mainnetHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns",
    dexSubgraphUris: {
      Uniswap: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      Sushiswap:
        "https://api.thegraph.com/subgraphs/name/steegecs/sushiswap-mainnet",
    },
    znsUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics.herokuapp.com",
    dataStoreUri: "https://apim-data-store-api-dev.azure-api.net/",
    utilitiesUri: "https://zero-utilities.azure-api.net",
    zAuction: {
      ...configuration(mainnetConfig),
    },
    basicController: mainnetBasicController,
    registrar: mainnetRegistrar,
    hub: mainnetHub,
    provider: provider,
    domainPurchaser: mainnetDomainPurchaser,
  };
};

const kovanRegistrar = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
const kovanHub = ethers.constants.AddressZero;
const kovanStaking = "0x1E3F8B31b24EC0E938BE45ecF6971584F90A1602";
const kovanBasicController = "0x2EF34C52138781C901Fe9e50B64d80aA9903f730";
const kovanDomainPurchaser = ethers.constants.AddressZero;

export const kovanConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const kovanConfig: zAuctionConfig = {
    web3Provider: provider,
    network: "kovan",
    znsHubAddress: kovanHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-kovan",
    dexSubgraphUris: {
      uniswap: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      sushiswap: "",
    },
    znsUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-kovan.herokuapp.com",
    dataStoreUri: "",
    utilitiesUri: "https://zero-utilities.azure-api.net",
    zAuction: {
      ...configuration(kovanConfig),
    },
    basicController: kovanBasicController,
    registrar: kovanRegistrar,
    hub: kovanHub,
    provider: provider,
    domainPurchaser: kovanDomainPurchaser,
  };
};

const rinkebyRegistrar = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca";
const rinkebyHub = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";
const rinkebyStaking = "0x7FDd24f30fB8a3E0021e85Fdb737a3483D3C8135";
const rinkebyBasicController = "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28";
const rinkebyDomainPurchaser = "0x2C2535D45C1EC97774fD61935D116e40a2A05ff5";
export const rinkebyConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const rinkebyConfig: zAuctionConfig = {
    web3Provider: provider,
    network: "rinkeby",
    znsHubAddress: rinkebyHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-rinkeby",
    dexSubgraphUris: {
      Uniswap: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      Sushiswap:
        "https://api.thegraph.com/subgraphs/name/steegecs/sushiswap-mainnet",
    },
    znsUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-rinkeby.herokuapp.com",
    dataStoreUri: "https://apim-data-store-api-rinkeby-dev.azure-api.net/",
    utilitiesUri: "https://zero-utilities.azure-api.net",
    zAuction: {
      ...configuration(rinkebyConfig),
    },
    basicController: rinkebyBasicController,
    registrar: rinkebyRegistrar,
    hub: rinkebyHub,
    provider: provider,
    domainPurchaser: rinkebyDomainPurchaser,
  };
};

const goerliRegistrar = "0x009A11617dF427319210e842D6B202f3831e0116";
const goerliHub = "0xce1fE2DA169C313Eb00a2bad25103D2B9617b5e1";
const goerliStaking = "";
const goerliBasicController = "0xd23299F8f0BF17d2d037a12985F83c29A630E6F8";
const goerliDomainPurchaser = "0x19f127f0a5ACCF0E6E2DdcE63085750a74EBc44A";
export const goerliConfiguration = (
  provider: ethers.providers.Provider
): Config => {
  const goerliConfig: zAuctionConfig = {
    web3Provider: provider,
    network: "goerli",
    znsHubAddress: goerliHub,
  };
  return {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-goerli",
    dexSubgraphUris: {
      Uniswap: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      Sushiswap:
        "https://api.thegraph.com/subgraphs/name/steegecs/sushiswap-mainnet",
    },
    znsUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-goerli.herokuapp.com/",
    dataStoreUri: "https://apim-data-store-api-goerli.azure-api.net/",
    utilitiesUri: "https://zero-utilities.azure-api.net",
    zAuction: {
      ...configuration(goerliConfig),
    },
    basicController: goerliBasicController,
    registrar: goerliRegistrar,
    hub: goerliHub,
    provider: provider,
    domainPurchaser: goerliDomainPurchaser,
  }
}
