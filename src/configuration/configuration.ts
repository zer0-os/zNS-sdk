import { ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";

export class Configuration implements zAuction.Config{
  web3Provider: ethers.providers.Web3Provider;
  apiUri: string;
  subgraphUri: string;
  zAuctionAddress: string;
  tokenContract: string;

  constructor(
    web3Provider: ethers.providers.Web3Provider,
    apiUri?: string,
    subgraphUri?: string,
    zAuctionAddress?: string,
    tokenContract?: string
  ) {
    this.web3Provider = web3Provider;
    this.apiUri = apiUri ?? "";
    this.subgraphUri = subgraphUri ?? "";
    this.zAuctionAddress = zAuctionAddress ?? "";
    this.tokenContract = tokenContract ?? "";
  }

  public setApiUri(apiUri: string) {
    this.apiUri = apiUri;
  }

  public setSubgraphUri(subgraphUri: string) {
    this.subgraphUri = subgraphUri;
  }

  public setZAuctionAddress(zAuctionAddress: string) {
    this.zAuctionAddress = zAuctionAddress;
  }

  public setTokenContract(tokenContract: string) {
    this.tokenContract = tokenContract;
  }
}
