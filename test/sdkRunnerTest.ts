import { ethers } from "ethers";
import * as sdk from "../src";
require("dotenv").config();
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL, "rinkeby");
const wallet = new ethers.Wallet("0x" + (process.env.TESTNET_PRIVATE_KEY_ASTRO as string), provider);
const instance = sdk.createInstance(
  sdk.configuration.rinkebyConfiguration(provider)
);

const main = async () => {
  const domains = await instance.minting.getPriceOfNetworkDomain("wildercats");
  //const available = await instance.minting.isNetworkDomainAvailable("wildercats");
  //const notAvailable = await instance.minting.isNetworkDomainAvailable("booty");
  const MintSubdomainStep = await instance.minting.mintNetworkDomain("civilizedglobe", wallet);
};

main().catch(console.error);

