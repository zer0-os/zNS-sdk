import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import * as zAuction from "@zero-tech/zauction-sdk";

import * as zNSSDK from "../src/index";
import * as subgraph from "../src/subgraph";
import * as actions from "../src/actions";
import {
  Config,
  IPFSGatewayUri,
  Listing,
  zAuctionRoute,
} from "../src/types";
import { Registrar } from "../src/contracts/types";
import { getRegistrar } from "../src/contracts";
import {
  createZAuctionInstances,
  getZAuctionInstanceForDomain,
} from "../src/utilities";
import { zAuctionConfiguration } from "../src/configuration/configuration";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"],
    4
  );

  const pk = process.env["PRIVATE_KEY"];
  if (!pk) throw Error("No private key");
  const signer = new ethers.Wallet(pk, provider);

  // Rinkeby
  const registrarAddress = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca";
  const basicControllerAddress = "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28";

  // Rinkeby config
  const config: Config = {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-rinkeby",
    metricsUri: "https://zns-metrics-kovan.herokuapp.com", // todo metrics on rinkeby
    apiUri: "https://zns.api.zero.tech/api",
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        // Use default values specified in config
        config: zAuctionConfiguration(provider, "rinkeby") as zAuction.Config,
      } as zAuctionRoute,
    ],
    basicController: basicControllerAddress,
    registrar: registrarAddress,
  };

  const qmHash = "Qmc2cMdNMo6isDTjk8gej8ay9dZxGQNS3ftsDpct1RNV2H";
  const domainId =
    "0x6e35a7ecbf6b6368bb8d42ee9b3dcfc8404857635036e60196931d4458c07622";

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
      // console.log(tx);
    });
    it("gets all domains", async () => {
      const sdkInstance = await zNSSDK.createInstance(config);
      const allDomains = await sdkInstance.getAllDomains();
      expect(allDomains);
    });
    it("gets a domain by an ID", async () => {
      const sdkInstance = await zNSSDK.createInstance(config);
      const domain = await sdkInstance.getDomainById(domainId);
      expect(domain);
    });
  });
  describe("getDomainMetadata", () => {
    it("runs as ipfs url", async () => {
      const registrarInstance = await getRegistrar(provider, registrarAddress);
      const metadata = await actions.getDomainMetadata(
        domainId,
        registrarInstance,
        IPFSGatewayUri.fleek
      );
      expect(metadata);
    });
    it("runs as well formed ipfs.fleek.co url", async () => {
      const registrarInstance = await getRegistrar(provider, registrarAddress);
      const metadata = await actions.getDomainMetadata(
        domainId,
        registrarInstance,
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
    //   console.log(tx.v);
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
      const zAuctionRouteUriToInstance = createZAuctionInstances(config);

      const zAuctionInstance = await getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        zAuctionRouteUriToInstance,
        domainIdToDomainName
      );
      // Set to a new value every time it's run,
      // still 1/100 chance it's the same price and that will fail
      const rand = Math.round(Math.random() * 100);
      const params: zAuction.BuyNowParams = {
        amount: ethers.utils.parseEther(`${rand}`).toString(),
        tokenId: domainId,
      };

      const address = await signer.getAddress();
      const isApproved = await zAuctionInstance.isZAuctionApprovedToTransferNft(
        address
      );

      if (!isApproved)
        await zAuctionInstance.approveZAuctionTransferNft(signer);

      const tx = await zAuctionInstance.setBuyNowPrice(params, signer);

      const listing: Listing = await zAuctionInstance.getBuyNowPrice(
        domainId,
        signer
      );
      expect(listing);
    });
  });
  describe("lockDomainMetadata", () => {
    it("runs", async () => {
      const registrar: Registrar = await getRegistrar(
        provider,
        registrarAddress
      );

      const isLocked = await registrar.isDomainMetadataLocked(domainId);

      const toSet = !isLocked;

      const tx = await actions.lockDomainMetadata(
        domainId,
        toSet,
        signer,
        registrar
      );
    });
  });
});
