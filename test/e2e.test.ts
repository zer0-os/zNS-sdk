import { ethers, Wallet } from "ethers";
import { getHubContract, getRegistrar } from "../src/contracts";
import * as dotenv from "dotenv";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Registrar, ZNSHub } from "../src/contracts/types";
import { Config } from "../src/types";
import { rinkebyConfiguration } from "../src/configuration";
import { createInstance } from "../src";

dotenv.config();

// Rinkeby Addresses
describe("SDK test", () => {
  let provider: JsonRpcProvider;
  let hub: ZNSHub;
  let registrar: Registrar;
  let signer: ethers.Signer;

  const ZNSHubAddress = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";
  // wilder.pancakes
  const wilderPancakesDomain =
    "0x6e35a7ecbf6b6368bb8d42ee9b3dcfc8404857635036e60196931d4458c07622";
  before(async () => {
    provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL, 4);
    hub = await getHubContract(provider, ZNSHubAddress);
  });

  it("Gets buynow sale events", async () => {
    const pk = process.env.TESTNET_PRIVATE_KEY_ASTRO;
    if(!pk) throw Error("no sir");

    const astroWallet = new ethers.Wallet(pk, provider);

    const config: Config = rinkebyConfiguration(provider);
    const sdk = createInstance(config);

    const wilderPancakes = "0x6e35a7ecbf6b6368bb8d42ee9b3dcfc8404857635036e60196931d4458c07622";
    const wilderCats = "0x617b3c878abfceb89eb62b7a24f393569c822946bbc9175c6c65a7d2647c5402";

    const domainEvents = await sdk.getDomainEvents(wilderPancakes);

    console.log(domainEvents)
  })
  it("Confirm listbids working through the SDKlist bids", async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      process.env.INFURA_URL,
      4
    );
    const config: Config = rinkebyConfiguration(provider);
    const domainFromBrett = "0xada136a490b49f140280941197b1c56cdc9668ec9c8b515c8f00d116b9942c09"
    const sdk = createInstance(config);
    const bids = await sdk.zauction.listBids(domainFromBrett)
    const bids2 = await sdk.zauction.listBidsByAccount("0xaE3153c9F5883FD2E78031ca2716520748c521dB")
    console.log(bids, bids2);
  });
  it("Get owner of domain", async () => {
    const registrarAddress = await hub.getRegistrarForDomain(
      wilderPancakesDomain
    );
    const registrar = await getRegistrar(provider, registrarAddress);
    const currentOwner = await registrar.ownerOf(wilderPancakesDomain);
    console.log(currentOwner);
  });
  it("Creates an SDK instance and transfers ownership", async () => {
    const config = rinkebyConfiguration(provider);

    // Create two wallets for transfer
    const pk = process.env.TESTNET_PRIVATE_KEY_ASTRO;
    if (!pk) throw Error("Must provide a private key for a signer in .env");
    const walletAstro = new Wallet(pk, provider);

    const pk2 = process.env.TESTNET_PRIVATE_KEY_MAIN;
    if (!pk2) throw Error("Must provide private key");
    const walletMain = new Wallet(pk2, provider);

    const toAddress = await walletMain.getAddress();
    const domainId = wilderPancakesDomain;
    const signer = walletAstro;

    const sdkInstance = createInstance(config);
    // const tx = await sdkInstance.transferDomainOwnership(toAddress, domainId, signer)
  });
});
