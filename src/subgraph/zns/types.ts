export interface AccountDto {
  id: string;
}

export interface ParentDomainDto {
  id: string;
}

export interface DomainIdDto {
  id: string;
}

export interface RegistrarContractDto {
  id: string;
}

export interface DomainDto extends DomainIdDto {
  name: string;
  parent?: ParentDomainDto;
  owner: AccountDto;
  minter?: AccountDto;
  metadata: string;
  lockedBy?: AccountDto;
  contract?: RegistrarContractDto;
  isLocked: boolean;
  indexId: string;
  metadataName?: string; // experimental feature
}

export interface DomainQueryDto {
  domain: DomainDto | null;
}

export interface DomainsQueryDto {
  domains: DomainDto[];
}
