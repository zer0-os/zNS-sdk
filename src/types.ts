export interface Domain {
  id: string;
  name: string;
  parentId: string;
  owner: string;
  minter: string;
  metadataUri: string;
}

export interface DomainTradingData {
  lastSale: string;
  lowestSale: string;
  highestSale: string;
}
