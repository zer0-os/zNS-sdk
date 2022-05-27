import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import * as zAuction from "@zero-tech/zauction-sdk";

import * as zNSSDK from "../src/index";
import * as subgraph from "../src/subgraph";
import * as actions from "../src/actions";
import { Config, IPFSGatewayUri, Listing, } from "../src/types";
import { Registrar } from "../src/contracts/types";
import { getHubContract, getRegistrar } from "../src/contracts";

import { rinkebyConfiguration } from "../src/configuration";
import { BuyNowListing } from "@zero-tech/zauction-sdk";
import { assert } from "console";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

const enum ChainId {
  mainnet = 1,
  rinkeby = 4,
  kovan = 42,
}

describe("Test Custom SDK Logic", () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env["INFURA_URL"],
      ChainId.rinkeby
    );
  
    const pk = process.env["TESTNET_PRIVATE_KEY_MAIN"];
    if (!pk) throw Error("No private key");
    const signer = new ethers.Wallet(pk, provider);
  
    // Rinkeby
    const registrarAddress = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca";
    const basicControllerAddress = "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28";
  
    // Rinkeby config
    const config: Config = rinkebyConfiguration(provider);
    const zAuctionSdkInstance = zAuction.createInstance(config.zAuction);
  
    const qmHash = "Qmc2cMdNMo6isDTjk8gej8ay9dZxGQNS3ftsDpct1RNV2H";
    const wilderPancakesDomain =
      "0x6e35a7ecbf6b6368bb8d42ee9b3dcfc8404857635036e60196931d4458c07622";
  
    const subgraphClient = subgraph.createClient(config.subgraphUri);
  
    const domainIdToDomainName = async (domainId: string) => {
      const domainData = await subgraphClient.getDomainById(domainId);
      return domainData.name;
    };

    describe("Domain actions", () => {
        it("gets 10 most recent domains", async () => {
          const sdkInstance = await zNSSDK.createInstance(config);
          const domains = await sdkInstance.getMostRecentDomains(10);
          expect(domains.length).to.equal(10);
        });
      });
});