import { ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";

export interface ConfigurationParameters {
  web3Provider: ethers.providers.Provider,
  network: string,
  apiUri?: string,
  subgraphUri?: string,
  zAuctionAddress?: string,
  zAuctionLegacyAddress?: string,
  wildTokenAddress?: string,
  znsHubAddress?: string,
}

export const zAuctionConfiguration = (
  params: ConfigurationParameters
): zAuction.Config => {
  let defaultApiUri;
  let defaultSubgraphUri;
  let defaultZAuctionAddress;
  let defaultTokenContract;
  let defaultLegacyZAuctionAddress;
  let defaultWildTokenAddress;
  let defaultZnsHubAddress;

  if (params.network === "mainnet" || params.network === "homestead") {
    defaultApiUri = "https://mainnet.zauction.api.zero.tech/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction";
    defaultZAuctionAddress = "0x411973Fa81158A4c7767a0D6F7dF62723fDd541F";
    defaultTokenContract = "0xc2e9678A71e50E5AEd036e00e9c5caeb1aC5987D";
    defaultLegacyZAuctionAddress = "0x05cBD37cA528B7ea50800aA80ddD0F9F30C952F0";
    defaultWildTokenAddress = "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34";
    defaultZnsHubAddress = "0x3F0d0a0051D1E600B3f6B35a07ae7A64eD1A10Ca"; 
  } else if (params.network === "kovan") {
    defaultApiUri = "https://zauction-kovan-api.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-kovan";
    defaultZAuctionAddress = "0x646757a5F3C9eEB4C6Bd136fCefE655B4A8107e4";
    defaultTokenContract = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";
    defaultLegacyZAuctionAddress = "0x18A804a028aAf1F30082E91d2947734961Dd7f89";
    defaultWildTokenAddress = "0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F";
    defaultZnsHubAddress = "";
  } else if (params.network == "rinkeby") {
    defaultApiUri = "https://zauction-api-rinkeby.herokuapp.com/api";
    defaultSubgraphUri =
      "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-rinkeby";
    defaultZAuctionAddress = "0xb2416Aed6f5439Ffa0eCCAaa2b643f3D9828f86B";
    defaultTokenContract = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca"; // not ERC20 token, technically 721 token
    defaultLegacyZAuctionAddress = "0x376030f58c76ECC288a4fce8F88273905544bC07";
    defaultWildTokenAddress = "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79";
    defaultZnsHubAddress = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";
  } else {
    throw Error(`params.network ${params.network} is not supported`);
  }

  const config: zAuction.Config = {
    web3Provider: params.web3Provider as ethers.providers.Web3Provider,
    apiUri: params.apiUri ?? defaultApiUri,
    subgraphUri: params.subgraphUri ?? defaultSubgraphUri,
    zAuctionAddress: params.zAuctionAddress ?? defaultZAuctionAddress,
    zAuctionLegacyAddress: params.zAuctionLegacyAddress ?? defaultLegacyZAuctionAddress,
    wildTokenAddress: params.wildTokenAddress ?? defaultWildTokenAddress,
    znsHubAddress: params.znsHubAddress ?? defaultZnsHubAddress
  };

  return config;
};
