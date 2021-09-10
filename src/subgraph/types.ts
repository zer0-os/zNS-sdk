export interface AccountDto {
  id: string;
}

export interface ParentDomainDto {
  id: string;
}

export interface DomainDto {
  id: string;
  name: string;
  parent: ParentDomainDto;
  owner: AccountDto;
  minter: AccountDto;
  metadata: string;
}

export interface DomainQueryDto {
  domain: DomainDto;
}

export interface DomainsQueryDto {
  domains: DomainDto[];
}
