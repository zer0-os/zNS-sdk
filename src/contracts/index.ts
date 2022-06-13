import { ethers } from "ethers";
import {
  BasicController,
  BasicController__factory,
  IERC20,
  IERC20__factory,
  Registrar,
  Registrar__factory,
  StakingController,
  StakingController__factory,
  ZNSHub,
  ZNSHub__factory,
} from "./types";
import { DomainPurchaser } from "./types/DomainPurchaser";
import { DomainPurchaser__factory } from "./types/factories/DomainPurchaser__factory";

export const getRegistrar = async (
  web3Provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<Registrar> => {
  const contract = Registrar__factory.connect(address, web3Provider);
  return contract;
};

export const getBasicController = async (
  web3Provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<BasicController> => {
  const contract = BasicController__factory.connect(address, web3Provider);
  return contract;
};

export const getStakingController = async (
  web3Provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<StakingController> => {
  const contract = StakingController__factory.connect(address, web3Provider);
  return contract;
};

export const getERC20Contract = async (
  web3Provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<IERC20> => {
  const contract = IERC20__factory.connect(address, web3Provider);
  return contract;
};

export const getHubContract = async (
  web3Provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<ZNSHub> => {
  const contract = ZNSHub__factory.connect(address, web3Provider);
  return contract;
};

export const getDomainPurchaserContract = async (
  web3Provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<DomainPurchaser> => {
  const contract = DomainPurchaser__factory.connect(address, web3Provider);
  return contract;
};
