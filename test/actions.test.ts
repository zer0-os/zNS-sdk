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

  // Rinkeby
  const wildToken = "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79";

  const subgraphClient = subgraph.createClient(config.subgraphUri);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.name;
  };

  describe("E2E with Rinkeby", () => {
    it("mints a domain", async () => {
      // private key must point to owner of parent domain, in this case wilder
      // const wilderId = "0x196c0a1e30004b9998c97b363e44f1f4e97497e59d52ad151208e9393d70bb3b"
      // const sdkInstance = await zNSSDK.createInstance(config);
      // const res = await fetch("https://www.rebeccas.com/mm5/graphics/00000001/cn134.jpg", {method: "GET"});
      // const ab = await res.arrayBuffer();
      // const buffer = Buffer.from(ab)
      // const params: zNSSDK.SubdomainParams = {
      //   parentId: wilderId,
      //   label: "candy",
      //   image: buffer,
      //   name: "So Sweet", // can be freeform
      //   description: "A treat",
      //   additionalMetadata: {},
      //   royaltyAmount: "5",
      //   lockOnCreate: false,
      //   owner: "0xbB6a3A7ea2bC5cf840016843FA01D799Be975320",
      // }
      // const tx = await sdkInstance.mintSubdomain(params, signer);
    });
    it("gets all domains", async () => {
      const sdkInstance = await zNSSDK.createInstance(config);
      const allDomains = await sdkInstance.getAllDomains();
      expect(allDomains);
    });
    it("gets a domain by an ID", async () => {
      const sdkInstance = await zNSSDK.createInstance(config);
      const domain = await sdkInstance.getDomainById(wilderPancakesDomain);
      expect(domain);
    });
  });
  describe("getDomainMetadata", () => {
    it("runs as ipfs url", async () => {
      const hub = await getHubContract(provider, config.hub);
      const metadata = await actions.getDomainMetadata(
        wilderPancakesDomain,
        hub,
        IPFSGatewayUri.fleek
      );
      expect(metadata);
    });
    it("runs as well formed ipfs.fleek.co url", async () => {
      const hub = await getHubContract(provider, config.hub);

      const metadata = await actions.getDomainMetadata(
        wilderPancakesDomain,
        hub,
        IPFSGatewayUri.fleek
      );
      expect(metadata);
    });
  });
  describe("setDomainMetadata", () => {
    // Keep as an example call, but comment it
    // it("runs setDomainMetadata", async () => {
    //   const registrar: Registrar = await getRegistrar(
    //     provider,
    //     registrarAddress
    //   );
    //   const lockedStatus = await registrar.isDomainMetadataLocked(domainId);
    //   // If locked, call to unlock before calling to set
    //   if(lockedStatus) {
    //     const tx = await registrar.connect(signer).lockDomainMetadata(domainId, false);
    //     await tx.wait(5); // Wait for unlock confirmation before trying to set metadata
    //   }
    //   const metadata = await actions.getDomainMetadata(
    //     domainId,
    //     registrar,
    //     IPFSGatewayUri.fleek);
    //   // Set to a new value every time it's run,
    //   // still 1/100 chance it's the same metadata and that will fail
    //   const rand = Math.round(Math.random() * 100);
    //   metadata.description = `A random number is: ${rand}`
    //   const client = createClient(config.apiUri);
    //   const tx = await actions.setDomainMetadata(
    //     domainId,
    //     metadata,
    //     client,
    //     signer,
    //     registrar
    //   );
    //   const retrievedMetadata = await actions.getDomainMetadata(
    //     domainId,
    //     registrar,
    //     IPFSGatewayUri.fleek
    //   );
    //   expect(metadata).deep.equal(retrievedMetadata);
    // });
  });
  describe("(get|set)buyNowPrice", () => {
    it("runs as expected", async () => {
      
      // Set to a new value every time it's run, loop is same as current price
      let listing: BuyNowListing = await zAuctionSdkInstance.getBuyNowPrice(
        wilderPancakesDomain
      );
      let newBuyNowPrice = ethers.utils.parseEther(
        Math.round(Math.random() * 100).toString()
      );
      while (listing.price.eq(newBuyNowPrice)) {
        newBuyNowPrice = ethers.utils.parseEther(
          Math.round(Math.random() * 100).toString()
        );
      }
      const params: zAuction.BuyNowParams = {
        amount: ethers.utils.parseEther(`${newBuyNowPrice}`).toString(),
        tokenId: wilderPancakesDomain,
        paymentToken: wildToken
      };

      const address = await signer.getAddress();
      const isApproved = await zAuctionSdkInstance.isZAuctionApprovedToTransferNftByDomain(
        address,
        wilderPancakesDomain
      );

      if (!isApproved)
        await zAuctionSdkInstance.approveZAuctionTransferNftByDomain(wilderPancakesDomain, signer);

      // const tx = await zAuctionSdkInstance.setBuyNowPrice(params, signer);

      listing = await zAuctionSdkInstance.getBuyNowPrice(
        wilderPancakesDomain,
      );
      assert(listing)
    });
  });
});
