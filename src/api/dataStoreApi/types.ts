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

export interface DomainCollection {
  numResults: number;
  result: DataStoreDomain[];
}