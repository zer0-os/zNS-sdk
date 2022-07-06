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
  owner: DomainProperty<string>;
  isValid: boolean;
  royaltyAmount: DomainProperty<string>;
  metadataUri: DomainProperty<string>;
  registrar: string;
  minter: string;
  label: string;
  labelHash: string;
  parent: string;
  created: Time;
  name: string;
  locked?: DomainProperty<boolean>; // Older domains may not have these properties
  lockedBy?: DomainProperty<string>;
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
  [domainProperty: string]: SortOrder
}

interface RequestBodyOptionsProjection {
  [domainProperty: string]: OptionsValue
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
