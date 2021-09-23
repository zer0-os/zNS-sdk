import * as zAuction from "@zero-tech/zauction-sdk";
import { Bid } from "@zero-tech/zauction-sdk";
import { ethers } from "ethers";

export interface Config {
  subgraphUri: string;
  apiUri: string;
  zAuctionRoutes: zAuctionRoute[];
  basicController: string;
}

/**
 * An instance of the zNS SDK
 */
export interface Instance {
  /**
   * Gets domain data for a domain
   * @param domainId Id of a domain
   */
  getDomainById(domainId: string): Promise<Domain>;

  /**
   * Finds domains whose name has *name* in their name
   * @param name domain name search pattern
   */
  getDomainsByName(name: string): Promise<Domain[]>;

  /**
   * Gets all domains owner by an address
   * @param owner Owner address
   */
  getDomainsByOwner(owner: string): Promise<Domain[]>;

  /**
   * Finds all subdomains of a given domain
   * @param domainId (parent) domain id
   */
  getSubdomainsById(domainId: string): Promise<Domain[]>;

  /**
   * Gets all domain events for a domain
   * @param domainId Domain id to get events for
   */
  getDomainEvents(domainId: string): Promise<DomainEvent[]>;

  /**
   * Gets the zAuction Instance for a domain.
   * @param domainId Domain id to fetch for
   */
  getZAuctionInstanceForDomain(domainId: string): Promise<zAuction.Instance>;

  /**
   * Gets trading data for a sub domain.
   * @param domainId Domain id to get subdomain trading data for
   */
  getSubdomainTradingData(domainId: string): Promise<DomainTradingData>;

  /**
   * Mints a new subdomain
   * @param params The subdomain parameters
   * @param signer The signer (wallet to create sub domain)
   * @param statusCallback Callback to know when each step completes
   */
  mintSubdomain(
    params: SubdomainParams,
    signer: ethers.Signer,
    statusCallback?: MintSubdomainStatusCallback
  ): Promise<ethers.ContractTransaction>;

  /**
   * These methods are for bidding/auctions
   */
  bidding: {
    /**
     * Checks whether a user account has approved zAuction to spend tokens on their
     * behalf. They need to approve zAuction to spend their tokens for their bid to
     * be valid and actionable by the seller.
     * @param domainId The domain id a user is going to bid for
     * @param account The user account that is going to bid
     * @param bidAmount The size of bid the user is trying to place
     */
    needsToApproveZAuctionToSpendTokens(
      domainId: string,
      account: string,
      bidAmount: ethers.BigNumber
    ): Promise<boolean>;

    /**
     * Approves zAuction to spend the needed tokens so that a bid may be placed.
     * @param domainId The domain id that is going to be bid on
     * @param signer The user account signer (connected wallet)
     */
    approveZAuctionToSpendTokens(
      domainId: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;

    /**
     * Places a bid for a domain
     * @param params The bid parameters
     * @param signer The user account signer (connected wallet)
     * @param statusCallback Status callback that is called on each step of this workflow
     */
    placeBid(
      params: PlaceBidParams,
      signer: ethers.Signer,
      statusCallback?: zAuction.PlaceBidStatusCallback
    ): Promise<void>;

    /**
     * Checks whether a user has approved zAuction to transfer NFT's on their behalf.
     * zAuction must be approved before a user can accept a bid for a domain they own.
     * @param domainId The domain ID that is going to be sold
     * @param account The user account which is selling the domain
     */
    needsToApproveZAuctionToTransferNfts(
      domainId: string,
      account: string
    ): Promise<boolean>;

    /**
     * Approves zAuction to transfer NFT's on behalf of the user.
     * Must be done before a bid can be accepted.
     * @param domainId The domain Id that is going to be sold
     * @param signer The user account which is selling the domain (connected wallet)
     */
    approveZAuctionToTransferNfts(
      domainId: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;

    /**
     * Accepts an existing bid to buy a domain.
     * @param bid The bid which is being accepted
     * @param signer The user which is selling the domain
     */
    acceptBid(
      bid: Bid,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;
  };
}

export interface zAuctionRoute {
  uriPattern: string;
  instance: zAuction.Instance;
}

export interface Domain {
  id: string;
  name: string;
  parentId: string;
  owner: string;
  minter: string;
  metadataUri: string;
}

export interface DomainMetadata {
  [key: string]: unknown | undefined;
  image: string;
  title: string;
  description: string;
  previewImage?: string;
}

export enum DomainEventType {
  mint,
  transfer,
  bid,
  sale,
}

export interface DomainEvent {
  type: DomainEventType;
  timestamp: string;
}

export interface DomainTransferEvent extends DomainEvent {
  from: string;
  to: string;
}

export interface DomainMintEvent extends DomainEvent {
  minter: string;
}

export interface DomainBidEvent extends DomainEvent {
  bidder: string;
  amount: string;
}

export interface DomainSaleEvent extends DomainEvent {
  buyer: string;
  seller: string;
  amount: string;
}

export interface DomainTradingData {
  lastSale: string;
  lowestSale: string;
  highestSale: string;
}

export enum MintSubdomainStep {
  UploadingImage,
  UploadingMetadata,
  SubmittingTransaction,
  Completed,
}

export type MintSubdomainStatusCallback = (step: MintSubdomainStep) => void;

export interface SubdomainParams {
  parentId: string;
  label: string;
  image: Buffer;
  previewImage?: Buffer;
  title: string;
  description: string;
  additionalMetadata: Record<string, unknown>;
  royaltyAmount: string;
  lockOnCreate: boolean;
}

export interface PlaceBidParams {
  domainId: string;
  bidAmount: ethers.BigNumber;
}