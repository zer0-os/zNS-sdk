import { ethers } from "ethers";
import { getHubContract, getRegistrar } from "../src/contracts";
import * as dotenv from "dotenv";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Registrar, ZNSHub } from "../src/contracts/types";

dotenv.config();

// Rinkeby Addresses
describe("SDK test", () => {
  let provider: JsonRpcProvider;
  let hub: ZNSHub;
  let registrar: Registrar;
  let signer: ethers.Signer;

  // wilder.pancakes
  const ZNSHubAddress = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";


  before(async () => {
    provider = new ethers.providers.JsonRpcProvider(
      process.env.INFURA_URL,
      4
    );
    hub = await getHubContract(provider, ZNSHubAddress)

    const pk = process.env.TESTNET_PRIVATE_KEY;
    if (!pk) throw Error("Must provide a private key for a signer in .env");

    signer = new ethers.Wallet(pk, provider);

  });

  it("Can transfer domain ownership", async () => {
    const tokenId =
  "0x6e35a7ecbf6b6368bb8d42ee9b3dcfc8404857635036e60196931d4458c07622";
    const registrarAddress = await hub.getRegistrarForDomain(tokenId);
    const otherRegAddress = await hub.domainToContract(tokenId);
    const registrar = await getRegistrar(provider, registrarAddress);
    const currentOwner = await registrar.ownerOf(tokenId);

    // Confirm signer from pk is current owner
    console.log(currentOwner);
    console.log(await signer.getAddress());
  });
  it("Gets registrar for a specific domain", async () => {
    // wilder.snowflake
    const tokenId = "0xada136a490b49f140280941197b1c56cdc9668ec9c8b515c8f00d116b9942c09";
    const registrarForDomainAddress = await hub.getRegistrarForDomain(tokenId)

    console.log(registrarForDomainAddress)

    // from src/helpers/index.ts
    let registrarAddress;

    try {
      registrarAddress = await hub.domainToContract(tokenId)
    } catch (e) {
      throw Error(`Failed to access hub: ${e}`);
    }

    if (registrarAddress === ethers.constants.AddressZero) {
      throw Error(`Null address for registrar.`);
    }

    const contract = getRegistrar(hub.provider, registrarAddress);
    return contract;
  });
});
