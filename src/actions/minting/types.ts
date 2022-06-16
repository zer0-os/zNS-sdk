import { ethers } from "ethers";
import { znsApiClient } from "../../api";
import { ZNSHub } from "../../contracts/types";
import { DomainPurchaser } from "../../contracts/types/DomainPurchaser";

export interface NetworkDomainMintableConfig {
  znsHub: ZNSHub;
  domainPurchaser: DomainPurchaserConfig;
  services: {
    apiClient: znsApiClient;
  };
}

export interface DomainPurchaserConfig {
  provider: ethers.providers.Provider;
  contractAddress: string;
}
