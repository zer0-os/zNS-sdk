import { ethers } from "ethers";
import * as sdk from "../src";
require("dotenv").config();
const provider = new ethers.providers.JsonRpcProvider(
  process.env.INFURA_URL,
  "rinkeby"
);
const wallet = new ethers.Wallet(
  "0x" + (process.env.TESTNET_PRIVATE_KEY_ASTRO as string),
  provider
);
const walletAddress = "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53";
const instance = sdk.createInstance(
  sdk.configuration.rinkebyConfiguration(provider)
);

const main = async () => {
  const domains = await instance.minting.getPriceOfNetworkDomain("wildercats");

  //Should not be available
  //const available = await instance.minting.isNetworkDomainAvailable("wildercats");

  //Should not pass content validation
  //const notAvailable = await instance.minting.isNetworkDomainAvailable("booty");

  //Should mint a network domain
  //const res = await instance.minting.approveMinterToSpendTokens(wallet, "0");
  //const MintSubdomainStep = await instance.minting.mintNetworkDomain("civilizedglobe", wallet);
};

main().catch(console.error);
