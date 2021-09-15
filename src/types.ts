import * as zAuction from "@zero-tech/zauction-sdk";

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
