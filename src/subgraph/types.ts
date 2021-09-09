export interface AccountDto {
  id: string;
}

export interface DomainDto {
  id: string;
  name: string;
  parent: string;
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

export interface ParentDomainDto extends DomainDto {
  subdomains: DomainDto[];
}
