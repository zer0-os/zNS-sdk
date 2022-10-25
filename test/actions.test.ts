import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import * as zAuction from "@zero-tech/zauction-sdk";

import * as zNSSDK from "../src/index";
import * as subgraph from "../src/subgraph";
import * as api from "../src/api";
import * as actions from "../src/actions";
import { Config, Domain, IPFSGatewayUri, Maybe } from "../src/types";
import { getHubContract, getRegistrar } from "../src/contracts";

import { goerliConfiguration } from "../src/configuration";
import { BuyNowListing } from "@zero-tech/zauction-sdk";
import { assert } from "console";
import { generateDefaultMetadata } from "../src/actions";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

const enum ChainId {
  mainnet = 1,
  rinkeby = 4,
  goerli = 5,
  kovan = 42,
}

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    process.env["INFURA_URL"],
    ChainId.goerli
  );

  const pk = process.env.PRIVATE_KEY_ASTRO;
  if (!pk) throw Error("No private key");
  const signer = new ethers.Wallet(pk, provider);

  // Goerli config
  const config: Config = goerliConfiguration(provider);
  const zAuctionSdkInstance = zAuction.createInstance(config.zAuction);

  const meowDomain = "0x6b9d6f1edf4b298f7edbfe917276cd16b632cc6062109192f4880c5a45d5d34e";
  const wilderDomain = "0x196c0a1e30004b9998c97b363e44f1f4e97497e59d52ad151208e9393d70bb3b";
  const wilderWheelsDomain = "0x7445164548beaf364109b55d8948f056d6e4f1fd26aff998c9156b0b05f1641f";

  const wildToken = "0x0e46c45f8aca3f89Ad06F4a20E2BED1A12e4658C";
  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const znsApiClient = api.createZnsApiClient(
    config.znsUri,
    config.utilitiesUri
  );

  const dataStoreApiClient = api.createDataStoreApiClient(config.dataStoreUri);
  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.name;
  };

  describe("E2E with Goerli", () => {
    describe("getDomainMetadata", () => {
      it("runs using IPFS gateway", async () => {
        const hub = await getHubContract(provider, config.hub);
        const metadata = await actions.getDomainMetadata(
          meowDomain,
          hub,
          IPFSGatewayUri.ipfs
        );
        expect(metadata).to.not.be.null;
      });
      it("runs using Fleek gateway", async () => {
        const hub = await getHubContract(provider, config.hub);

        const metadata = await actions.getDomainMetadata(
          wilderWheelsDomain,
          hub,
          IPFSGatewayUri.fleek
        );
        expect(metadata).to.not.be.null;
      });
    });
    describe("Domain Metadata", () => {
      it("generates default metadata", async () => {
        const metadata = await generateDefaultMetadata(znsApiClient, "test");
        expect(metadata).contains("ipfs://Qm");
      });
    });

    describe("getSubdomainsById", () => {
      it("Returns a number of subdomains that isn't 0", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomain
        );
        expect(subdomains.length).to.not.eq(0);
      });
      it("Returns a number of domains that isn't 0 through the subgraph", async () => {
        const sdkInstance = await zNSSDK.createInstance(config);
        const subdomains = await sdkInstance.getSubdomainsById(wilderDomain, false);
        expect(subdomains.length).to.not.eq(0);
      });
      it("Returns empty array for domains that have no subdomains", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          meowDomain
        );
        expect(subdomains.length).to.eq(0);
      });
      it("Returns empty array for domains that have no subdomains through the subgraph", async () => {
        const sdkInstance = await zNSSDK.createInstance(config);
        const subdomains = await sdkInstance.getSubdomainsById(meowDomain, false);
        expect(subdomains.length).to.eq(0);
      });
    });

    describe("get domains", () => {
      it("gets most recent domains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getMostRecentDomains(10, 0);
        expect(domains.length).to.equal(10);
      });
      it("cannot get over 5000 most recent domains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        expect(sdkInstance.getMostRecentDomains(5000, 0)).to.eventually.throw(
          Error
        );
      });
      it("gets most recent subdomains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getMostRecentSubdomainsById(
          wilderDomain,
          2,
          0,
          false
        );
        expect(domains.length).to.equal(2);
      });
      it("gets most recent subdomains via the data store", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getMostRecentSubdomainsById(
          wilderDomain,
          2,
          0,
          true
        );
        expect(domains.length).to.equal(2);
      });
      it("Fails when requesting over 5000 most recent subdomains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        expect(
          sdkInstance.getMostRecentSubdomainsById(wilderDomain, 5000, 0, false)
        ).to.eventually.throw(Error);
      });
    });

    describe("content moderator", () => {
      it("flags inappropriate content", async () => {
        var sample = `booty`;
        const sdkInstance = zNSSDK.createInstance(config);
        const moderation = await sdkInstance.utility.checkContentModeration(
          sample
        );
        expect(moderation.flagged).to.be.true;
        expect(moderation.reason).to.equal("Contains explicit content.");
      });

      it("flags special characters", async () => {
        var sample = `2 Chainz!`;
        const sdkInstance = zNSSDK.createInstance(config);
        const moderation = await sdkInstance.utility.checkContentModeration(
          sample
        );
        expect(moderation.flagged).to.be.true;
        expect(moderation.reason).to.equal("Contains special characters.");
      });

      it("does not flag acceptable content", async () => {
        var sample = `2Chains`;
        const sdkInstance = zNSSDK.createInstance(config);
        const moderation = await sdkInstance.utility.checkContentModeration(
          sample
        );
        expect(moderation.flagged).to.be.false;
      });
    });
  });
});
