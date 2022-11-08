import { BuyNowListing } from "@zero-tech/zauction-sdk";

// move these to more specific types file
interface Time {
  timestamp: string;
  blockNumber: number;
  logIndex: number;
}
interface Transfer {
  from: string;
  to: string;
  time: Time;
}
interface DomainHistory {
  transfers: Transfer[];
}
interface DomainProperty<T> {
  value: T;
  time: Time;
}
export interface DataStoreDomain {
  domainId: string;
  isRoot: boolean;
  children: string[];
  history: DomainHistory;
  owner: string;
  isValid: boolean;
  royaltyAmount: string;
  metadataUri: string;
  registrar: string;
  minter: string;
  label: string;
  labelHash: string;
  parent: string;
  created: Time;
  name: string;
  buyNow: BuyNow
  locked: boolean; // Older domains may not have these properties
  lockedBy: string;
}

export interface BuyNowPriceListing {
  lister: string,
  price: string,
  paymentToken: string,
} 

export interface BuyNow {
  listing: BuyNowPriceListing
  isActive: boolean
}

type Show = 1;
type Hide = 0;
type OptionsValue = Show | Hide;

type Ascending = 1;
type Descending = -1;
type SortOrder = Ascending | Descending;

export interface DomainCollection {
  numResults: number;
  results: DataStoreDomain[];
}

interface RequestBodyOptionsSort {
  [domainProperty: string]: SortOrder;
}

interface RequestBodyOptionsProjection {
  [domainProperty: string]: OptionsValue;
}

interface RequestBodyOptions {
  sort?: RequestBodyOptionsSort;
  projection?: RequestBodyOptionsProjection;
}
export interface RequestBody {
  options?: RequestBodyOptions;
  skip?: number;
  limit?: number;
}

export type DomainSortOptions = {
  created?: number;
  domainId?: number;
  isRoot?: number;
  children?: number;
  history?: number;
  label?: number;
  name?: number;
  parent?: number;
  labelHash?: number;
  minter?: number;
  owner?: number;
  metadataUri?: number;
  royaltyAmount?: number;
  registrar?: number;
  isValid?: number;
  buyNow?: number;
};
