import * as zAuction from "./zAuction";
import { ethers } from "ethers";

/**
 * Configuration for a zNS sdk instance
 */
export interface Config {
  /** The zNS Subgraph URL */
  subgraphUri: string;
  /** The Metrics server api URL */
  metricsUri: string;
  /** The zNS backend api URL */
  apiUri: string;
  /** Routing table for zAuction */
  zAuctionRoutes: zAuctionRoute[];
  /** Address of the zNS Basic controller to use */
  basicController: string;
  /** Address of the root zNS Registrar */
  registrar: string;
  /** Address of the zNS Hub */
  hub: string;
  /** Web3 provider to make web3 calls with */
  provider: ethers.providers.Provider;
}

export interface Listing {
  price: number;
  holder: string;
}

export interface ZAuctionInstances {
  [registrarAddress: string]: zAuction.Instance;
}

export interface RouteUriToInstance {
  [key: string]: ZAuctionInstances;
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
   * Gets all domains
   */
  getAllDomains(): Promise<Domain[]>;

  /**
   * Gets trading data for a sub domain.
   * @param domainIds Domain ids to get subdomain trading data for
   */
  getDomainMetrics(domainIds: string[]): Promise<DomainMetricsCollection>;

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
   * Check the current lock status of a domain's metadata
   *
   * @param domainId The domain whose metadata lock status is being checked
   * @param signer The connected account
   */
  isDomainMetadataLocked(
    domainId: string,
    signer: ethers.Signer
  ): Promise<boolean>;

  /**
   * Set the lock status of metadata to define whether it can
   * or cannot be changed
   * @param domainId The domain with metadata to be locked/unlocked
   * @param lockStatus What to set the locked status too (true/false)
   * @param signer The account that signs and sends the transaction
   */
  lockDomainMetadata(
    domainId: string,
    lockStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /**
   * Get the metadata uri for a given domain
   *
   * @param domainId The domain to get metadata for
   * @param signer The account used in instantiating the registrar
   */
  getDomainMetadata(
    domainId: string,
    signer: ethers.Signer
  ): Promise<DomainMetadata>;
  /**
   * Set the domain metadata to a given metadata object
   *
   * @param domainId The id of the domain to set
   * @param metadata An object containing any desired properties of the updated metadata
   * @param signer: The account used in the transaction, which must be the owner of the domain
   */
  setDomainMetadata(
    domainId: string,
    metadata: DomainMetadata,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
  /**
   * Set the domain metadata to a given metadata uri
   *
   * @param domain
   */
  setDomainMetadataUri(
    domainId: string,
    metadataUri: string,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
  /**
   * Get the current metadata for a given domain
   * @param domainId The id of the domain
   * @param signer The account used in instantiating the registrar
   */
  getDomainMetadataUri(
    domainId: string,
    signer: ethers.Signer
  ): Promise<string>;

  /**
   * Update the metadata of a given domain and then lock the domain
   * metadata from changing in the future. Note we do not accept a
   * `lockStatus` param because we can always assume that a call to
   * `setAndLockMetadata` intends to lock the metadata after modifying it
   * @param domainId The domain with metadata to be locked/unlocked
   * @param metadataUri The link that the metadata should be updated to
   * @param signer The account that signs and sends the transaction
   */
  setAndLockDomainMetadata(
    domainId: string,
    metadata: DomainMetadata,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
  /**
   * Update the metadata of a given domain and then lock the domain
   * metadata from changing in the future. Note we do not accept a
   * `lockStatus` param because we can always assume that a call to
   * `setAndLockMetadata` intends to lock the metadata after modifying it
   * @param domainId The domain with metadata to be locked/unlocked
   * @param metadataUri The link that the metadata should be updated to
   * @param signer The account that signs and sends the transaction
   */
  setAndLockDomainMetadataUri(
    domainId: string,
    metadataUri: string,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /**
   * Update the royalty amount for a given domain that gets paid
   * to the minter on domain sale
   * @param domainId The domain with metadata to be locked/unlocked
   * @param amount The link that the metadata should be updated to
   * @param signer The account that signs and sends the transaction
   */
  setDomainRoyalty(
    domainId: string,
    amount: ethers.BigNumber,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /**
   * Transfer the ownership of a domain
   * Uses `safeTransferFrom`
   * @param to The address to transfer ownership to
   * @param domainId The domain to be transferred
   * @param signer Signer to do the tx with (must be the owner of the domain)
   */
  transferDomainOwnership(
    to: string,
    domainId: string,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /**
   * These methods are for bidding or sales of domains
   */
  zauction: {
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
     * Checks whether a user has approved zAuction to transfer NFT's on their behalf.
     * zAuction must be approved before a user can accept a bid for a domain they own.
     * @param domainId The domain ID that is going to be sold
     * @param account The user account which is selling the domain
     * @param bid The bid that is being transferred for
     */
    needsToApproveZAuctionToTransferNftsByBid(
      domainId: string,
      account: string,
      bid: zAuction.Bid
    ): Promise<boolean>;

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
    approveZAuctionToTransferNftsByBid(
      domainId: string,
      bid: zAuction.Bid,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;

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
     * Cancel a bid for a domain, only callable by the creator of that bid
     * @param bidNonce The id used to identify the bid
     * @param signer The user account signer (connected wallet)
     */
    cancelBid(
      bidNonce: string,
      signedBidMessage: string,
      domainId: string,
      cancelOnChain: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction | void>;

    /**
     * View all the bids for a given domain ID
     * @param domainId The id of the domain
     */
    listBids(domainId: string): Promise<zAuction.Bid[]>;

    /**
     * View all the bids placed by an account
     * @param account The account placing the bids
     */
    listBidsByAccount(account: string): Promise<zAuction.Bid[]>;

    /**
     * Accepts an existing bid to buy a domain.
     * @param bid The bid which is being accepted
     * @param signer The user which is selling the domain
     */
    acceptBid(
      bid: zAuction.Bid,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;

    /**
     * Purchases a domain
     * @param params Parameters of the buy now operation
     * @param signer The signer for who is buying now
     */
    buyNow(
      params: zAuction.BuyNowParams,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;

    /**
     * Gets the buy now price of a domain
     * @param domainId The token to get the price for
     */
    getBuyNowPrice(domainId: string): Promise<string>;

    /**
     * Sets the buy now price for a domain
     * @param params Parameter object
     * @param signer The signer
     */
    setBuyNowPrice(
      params: zAuction.BuyNowParams,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;

    /**
     * Cancels the buy now price (disables buy now)
     * @param domainId The domain to cancel buy now for
     * @param signer The signer
     */
    cancelBuyNow(
      domainId: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction>;
  };

  /**
   * An assortment of utility functions
   */
  utility: {
    /**
     * Uploads some media content that is either a video or image to IPFS
     * and the zNS content api.
     * @param media Buffer of image or video data
     * @returns A string which is the URL that the content is uploaded to
     */
    uploadMedia(media: Buffer): Promise<string>;

    startUrlUploadJob(urls: string[]): Promise<UrlToJobId>; // returns job ids

    checkBulkUploadJob(jobIds: string[]): Promise<UploadJobStatus>; // return status of the jobs

    checkUploadJob(jobId: string): Promise<UploadJobStatus>;

    /**
     * Uploads an object to IPFS as JSON
     * @param object Some object
     * @returns A string which is the URL that the content is uploaded to
     */
    uploadObjectAsJson(object: Record<string, unknown>): Promise<string>;

    /**
     * Helper to download domain metadata.
     * @param metadataUri Metadata Uri. Can be http(s):// or ipfs://
     */
    getMetadataFromUri(
      metadataUri: string,
      ipfsGatewayOverride?: string
    ): Promise<DomainMetadata>;
  };
}

export interface UploadJobStatus {
  [jobId: string]: {
    isCompleted: boolean;
    result: {
      url: string;
      hash: string;
    };
    failed: boolean;
    error?: string;
  };
}

export interface UrlToJobId {
  [url: string]: string;
}

export interface JobIdToUrl {
  [jobId: string]: string;
}

export interface UrlToIPFS {
  [url: string]: string;
}

export interface InvalidInputMessage {
  errorMessage: string;
}

export interface zAuctionRoute {
  uriPattern: string;
  config: zAuction.Config;
}

export interface Domain {
  id: string;
  name: string;
  parentId: string;
  owner: string;
  minter: string;
  metadataUri: string;
  isLocked: boolean;
  lockedBy: string;
  contract: string;
  isRoot?: boolean;
  metadataName?: string;
}

export interface DomainMetadata {
  [key: string]: unknown | undefined;
  image: string;
  animation_url: string | undefined;
  name: string;
  description: string;
  stakingRequests: "disabled" | "enabled" | undefined;
  isBiddable?: boolean;
  gridViewByDefault?: boolean;
  customDomainHeader?: boolean;
  previewImage?: string;
  customDomainHeaderValue?: string;
}

export enum IPFSGatewayUri {
  ipfs = "ipfs.io",
  fleek = "ipfs.fleek.co",
  infura = "ipfs.infura.io",
}

export enum DomainEventType {
  mint,
  transfer,
  bid,
  sale,
  buyNow,
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

export type DomainBuyNowSaleEvent = DomainSaleEvent;

export interface DomainMetrics {
  highestSale: string;
  lowestSale: string;
  lastSale: string;
  lastBid: string;
  highestBid: string;
  numberOfBids: number;
  volume: {
    all: string;
    day: string;
    week: string;
    month: string;
    year: string;
  };
  items: number; // total # of subdomains (recursive)
  holders: number; // number of unique wallets that own domains
}

export interface DomainMetricsCollection {
  [domainId: string]: DomainMetrics;
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
  name: string;
  description: string;
  additionalMetadata: Record<string, unknown>;
  royaltyAmount: string;
  lockOnCreate: boolean;
  animation?: Buffer;
  owner?: string;
}

/**
 * Place bid parameters
 */
export interface PlaceBidParams {
  /** Domain id that is being bid on */
  domainId: string;
  /** The amount of the bid (make sure to include 10^18 decimals) */
  bidAmount: ethers.BigNumber;
}
