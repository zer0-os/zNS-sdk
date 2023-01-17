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
import { domainSortingOptionsReflection } from "../src/api/dataStoreApi/helpers/desiredSortToQueryParams";
import * as subgraphActionDefaults from "../src//subgraph/zns/actions/defaults";
import Sinon from "sinon";

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

  const meowDomainId =
    "0x6b9d6f1edf4b298f7edbfe917276cd16b632cc6062109192f4880c5a45d5d34e";
  const wilderDomainId =
    "0x196c0a1e30004b9998c97b363e44f1f4e97497e59d52ad151208e9393d70bb3b";
  const wilderWheelsDomainId =
    "0x7445164548beaf364109b55d8948f056d6e4f1fd26aff998c9156b0b05f1641f";
  const fakeDomainId =
    "0x1231231231123123123112312312311231231231123123123112312312311231";
  const wildercats1Id =
    "0x6b2879c615f5d2dad3fb24438c6cc763d0f00c838491072b8cc20a1f16aa0f81"; // domain with no subdomains - wilder.cats.1
  const wapesId =
    "0xe5a72b935210b1d06e09b860d705571d5471274d31b10d8427341334b4bf4649"; // domain with 1 subdomain - wilder.beaststestdrop.wape

  const astroAccount = "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53";
  const dummyAccount = "0xa74b2de2D65809C613010B3C8Dc653379a63C55b";
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
          meowDomainId,
          hub,
          IPFSGatewayUri.ipfs
        );
        expect(metadata).to.not.be.null;
      });
      it("runs using Fleek gateway", async () => {
        const hub = await getHubContract(provider, config.hub);

        const metadata = await actions.getDomainMetadata(
          wilderWheelsDomainId,
          hub,
          IPFSGatewayUri.fleek
        );
        expect(metadata).to.not.be.null;
      });
    });
    describe("Generate Metadata", () => {
      it("generates default metadata", async () => {
        const metadata = await generateDefaultMetadata(znsApiClient, "test");
        expect(metadata).contains("ipfs://Qm");
      });
    });
    
    describe("Action options", () => {
      // https://wilderworld.atlassian.net/browse/MUD-91
      xit("Returns all results via data store when limit is 0", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomainId,
          100,
          0,
        );
      })
    })

    describe("getSubdomainsById", () => {
      it("Returns subdomains filtered by name aescending", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomainId,
          100,
          0,
          { "name": "asc"},
          "wilder.m"
        );
        expect(subdomains.length).to.eq(2);
        expect(subdomains[0].name).to.eq("wilder.moto"),
        expect(subdomains[1].name).to.eq("wilder.mountains")
      });

      it("Returns subdomains filtered by name descending", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomainId,
          100,
          0,
          { "name": "desc"},
          "wilder.m"
        );
        expect(subdomains.length).to.eq(2);
        expect(subdomains[0].name).to.eq("wilder.mountains"),
        expect(subdomains[1].name).to.eq("wilder.moto")
      });

      it("Returns subdomains deep filtered by name descending", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsByIdDeep(
          wilderDomainId,
          100,
          0,
          { "name": "desc"},
          "wa"
        );
        expect(subdomains.length).to.not.eq(0);
        expect(subdomains[0].name).to.eq("wilder.ultra-beasts.wapes"),
        expect(subdomains[subdomains.length - 1].name).to.eq("wilder.beaststestdrop.wape")
      });

      it("Returns a number of subdomains that isn't 0", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomainId,
          0,
          0
        );
        expect(subdomains.length).to.not.eq(0);
      });

      it("Return subdomains sorted by a domain property", async () => {
        const supportedSortProps = Object.keys(domainSortingOptionsReflection);
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomainId,
          0,
          0
        );
        expect(subdomains.length).to.not.eq(0);

        for (const key of supportedSortProps) {
          const subdomains: Domain[] =
            await dataStoreApiClient.getSubdomainsById(wilderDomainId, 100, 0, {
              [key]: "asc",
            });
          if(subdomains.length === 0) {
            console.log(key);
          }
          expect(subdomains.length).to.not.eq(0);
        }
      });

      it("Return subdomains deep sorted by a domain property", async () => {
        const supportedSortProps = Object.keys(domainSortingOptionsReflection);
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wilderDomainId,
          0,
          0,
          { "buyNow.price": "asc" }
        );
        expect(subdomains.length).to.not.eq(0);
      });

      it("Returns a number of domains that isn't 0 through the subgraph", async () => {
        const sdkInstance = await zNSSDK.createInstance(config);
        const subdomains = await sdkInstance.getSubdomainsById(
          wilderDomainId,
          false
        );
        expect(subdomains.length).to.not.eq(0);
      });

      it("Returns empty array for domains that have no subdomains", async () => {
        const subdomains: Domain[] = await dataStoreApiClient.getSubdomainsById(
          wildercats1Id,
          100,
          0
        );
        expect(subdomains.length).to.eq(0);
      });
      it("Returns empty array for domains that have no subdomains through the subgraph", async () => {
        const sdkInstance = await zNSSDK.createInstance(config);

        const subdomains = await sdkInstance.getSubdomainsById(
          wildercats1Id,
          false
        );

        expect(subdomains.length).to.eq(0);
      });

      it("Returns results from subgraph when available subdomain results is exactly query count", async () => {
        let queryCountStub = Sinon.stub(
          subgraphActionDefaults,
          "getSubdomainsByIdDefaultQueryCount"
        );

        queryCountStub.returns(1);
        const sdkInstance = await zNSSDK.createInstance(config);

        const subdomains = await sdkInstance.getSubdomainsById(wapesId, false);

        expect(subdomains.length).to.eq(1);
        queryCountStub.restore();
      });
    });
    describe("Get domains", () => {
      it("Gets most recent domains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getMostRecentDomains(10, 0);
        expect(domains.length).to.equal(10);
      });
      it("Cannot get over 5000 most recent domains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        expect(sdkInstance.getMostRecentDomains(5000, 0)).to.eventually.throw(
          Error
        );
      });
      it("Gets most recent subdomains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getMostRecentSubdomainsById(
          wilderDomainId,
          2,
          0,
          false
        );
        expect(domains.length).to.equal(2);
      });
      it("Gets most recent subdomains via the data store", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getMostRecentSubdomainsById(
          wilderDomainId,
          2,
          0,
          true
        );
        expect(domains.length).to.equal(2);
      });
      it("Fails when requesting over 5000 most recent subdomains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        expect(
          sdkInstance.getMostRecentSubdomainsById(
            wilderDomainId,
            5000,
            0,
            false
          )
        ).to.eventually.throw(Error);
      });
      it("Calls getDomainById", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const wilderWheelsDomain = await sdkInstance.getDomainById(
          wilderWheelsDomainId
        );
        expect(wilderWheelsDomain.id).to.eq(wilderWheelsDomainId);
      });
      it("Calls getDomainById through the subgraph", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const wilderWheelsDomain = await sdkInstance.getDomainById(
          wilderWheelsDomainId,
          false
        );
        expect(wilderWheelsDomain.id).to.eq(wilderWheelsDomainId);
      });
      it("Fails when getDomainById is given a unknown ID", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const wilderWheelsDomain = sdkInstance.getDomainById(fakeDomainId);
        await expect(wilderWheelsDomain).to.be.rejectedWith(
          `Failed to get domain: ${fakeDomainId}`
        );
      });
      it("Fails through the subgraph when getDomainById is given a unknown ID", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const wilderWheelsDomain = sdkInstance.getDomainById(fakeDomainId);
        await expect(wilderWheelsDomain).to.be.rejectedWith(
          `Failed to get domain: ${fakeDomainId}`
        );
      });
      it("Gets domains by owner using the DataStore Api", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getDomainsByOwner(astroAccount, true);
        expect(domains.length).to.be.gt(0);
      });
      it("Gets domains by owner using the Subgraph", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getDomainsByOwner(
          astroAccount,
          false
        );
        expect(domains.length).to.be.gt(0);
      });
      it("Returns no domains when owner has none", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getDomainsByOwner(dummyAccount);
        expect(domains.length).to.eq(0);
      });
      it("Returns no domains through the subgraph when owner has none", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getDomainsByOwner(
          dummyAccount,
          false
        );
        expect(domains.length).to.eq(0);
      });
      it("Gets domains by name", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getDomainsByName("wilder");
        expect(domains.length).to.be.gt(0);
      });
      it("Gets no domains by name when not found", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getDomainsByName("kiplermania");
        expect(domains.length).to.be.eq(0);
      });
      it("Gets all the domains", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domains = await sdkInstance.getAllDomains();
        expect(domains.length).to.be.gt(0);
      });
      it("Gets domain events", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const domainEvents = await sdkInstance.getDomainEvents(wilderDomainId);
        expect(domainEvents.length).to.be.gt(0);
      });
      it("Gets domain metrics", async () => {
        const sdkInstance = zNSSDK.createInstance(config);
        const metricsCollection = await sdkInstance.getDomainMetrics([
          meowDomainId,
          wilderDomainId,
        ]);
        expect(metricsCollection).to.be.not.null;
      });
    });
    describe("Sort domains by order", async () => {
      it("Sort domains by buyNow.price when get subdomains by domain Id", async () => {
        const subDomainsDesc: Domain[] =
          await dataStoreApiClient.getSubdomainsById(wilderDomainId, 0, 0, {
            "buyNow.price": "desc",
          });

        let prevDomain: Domain = subDomainsDesc[0];
        expect(
          subDomainsDesc.reduce((prev: boolean, currentDomain: Domain) => {
            if (!prevDomain.buyNow || !currentDomain.buyNow) {
              return prev;
            }

            const compared =
              prev &&
              ethers.BigNumber.from(prevDomain.buyNow.price).gte(
                ethers.BigNumber.from(currentDomain.buyNow.price)
              );
            prevDomain = currentDomain;
            return compared;
          }, true)
        ).to.be.eq(true);

        const subDomainsAsc: Domain[] =
          await dataStoreApiClient.getSubdomainsById(wilderDomainId, 0, 0, {
            "buyNow.price": "asc",
          });

        prevDomain = subDomainsAsc[0];
        expect(
          subDomainsAsc.reduce((prev: boolean, currentDomain: Domain) => {
            if (!prevDomain.buyNow || !currentDomain.buyNow) {
              return prev;
            }

            const compared =
              prev &&
              ethers.BigNumber.from(prevDomain.buyNow.price).lte(
                ethers.BigNumber.from(currentDomain.buyNow.price)
              );
            prevDomain = currentDomain;
            return compared;
          }, true)
        ).to.be.eq(true);
      });
      // broken in prod, disabling until fix identified
      xit("Sort domains by buyNow.time when get subdomains by domain Id", async () => {
        const wilder_boat_notreal =
          "0x6f0975dc0b1afae3543b5ec60b4ff289a8b7fe9ed9afe026436ff6dcbdd646e4";
        const subDomainsDesc: Domain[] =
          await dataStoreApiClient.getSubdomainsByIdDeep(
            wilderDomainId,
            100,
            0,
            {
              "buyNow.time": "desc",
            }
          );

        let prevDomain: Domain = subDomainsDesc[0];
        expect(
          subDomainsDesc.reduce((prev: boolean, currentDomain: Domain) => {
            // buyNow.time should be applied on active buyNow
            // check `datastoreDomainToDomain()` function
            if (!prevDomain.buyNow && currentDomain.buyNow) {
              return false;
            }

            if (!currentDomain.buyNow) {
              prevDomain = currentDomain;
              return prev;
            }

            const compared =
              prev &&
              ethers.BigNumber.from(prevDomain.buyNow!.price).gte(
                ethers.BigNumber.from(currentDomain.buyNow.price)
              );
            prevDomain = currentDomain;
            return compared;
          }, true)
        ).to.be.eq(true);

        const subDomainsAsc: Domain[] =
          await dataStoreApiClient.getSubdomainsByIdDeep(
            wilderDomainId,
            100,
            0,
            {
              "buyNow.time": "asc",
            }
          );

        prevDomain = subDomainsAsc[0];
        expect(
          subDomainsAsc.reduce((prev: boolean, currentDomain: Domain) => {
            // buyNow.time should be applied on active buyNow
            // check `datastoreDomainToDomain()` function
            if (!prevDomain.buyNow && currentDomain.buyNow) {
              return false;
            }

            if (!currentDomain.buyNow) {
              prevDomain = currentDomain;
              return prev;
            }

            const compared =
              prev &&
              ethers.BigNumber.from(prevDomain.buyNow!.price).lte(
                ethers.BigNumber.from(currentDomain.buyNow.price)
              );
            prevDomain = currentDomain;
            return compared;
          }, true)
        ).to.be.eq(true);
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
    describe("Domain Purchaser", () => {
      it("Confirms a domain is available", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const available = await sdkInstance.minting.isNetworkDomainAvailable(
          "candyDAO"
        );
        expect(available).to.eq(true);
      });
      it("Confirms a domain is not available", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const available = await sdkInstance.minting.isNetworkDomainAvailable(
          "wilder"
        );
        expect(available).to.eq(false);
      });
      it("Returns false when network name is too long", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const available = await sdkInstance.minting.isNetworkDomainAvailable(
          "wilderwilderwilderwilderwilderwilderwilderwilder"
        );
        expect(available).to.eq(false);
      });
      it("Returns false when network name is empty", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const available = await sdkInstance.minting.isNetworkDomainAvailable(
          ""
        );
        expect(available).to.eq(false);
      });
      it("Gets the price of network domains based on length", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        let price: string;

        // Short is < 4
        price = await sdkInstance.minting.getPriceOfNetworkDomain("can");
        expect(price).to.eq("1.0");
        // Medium is 4 < x < 8
        price = await sdkInstance.minting.getPriceOfNetworkDomain("candyyy");
        expect(price).to.eq("2.0");
        // Long is 8 < x < 33
        price = await sdkInstance.minting.getPriceOfNetworkDomain("candyyyy");
        expect(price).to.eq("3.0");
      });
      it("Fails to get price when network name is too long", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const price = await sdkInstance.minting.getPriceOfNetworkDomain(
          "wilderwilderwilderwilderwilderwilderwilderwilder"
        );
        expect(price).to.eq("-1.0");
      });
      it("Fails to get price when network name is empty", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const price = await sdkInstance.minting.getPriceOfNetworkDomain("");
        expect(price).to.eq("-1.0");
      });
      it("Returns true when a minter who has approved is checked", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const approved =
          await sdkInstance.minting.isMinterApprovedToSpendTokens(astroAccount);
        expect(approved).to.eq(true);
      });
      it("Returns false when a minter who is not approved is checked", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const approved =
          await sdkInstance.minting.isMinterApprovedToSpendTokens(dummyAccount);
        expect(approved).to.eq(false);
      });
      it("Always returns a user's allowance", async () => {
        const sdkInstance = zNSSDK.createInstance(config);

        const approvedDummy = await sdkInstance.minting.getTokenSpendAllowance(
          dummyAccount
        );
        expect(approvedDummy.toString()).to.eq("0");

        const approvedAstro = await sdkInstance.minting.getTokenSpendAllowance(
          astroAccount
        );
        expect(approvedAstro.toString()).to.not.eq("0");
      });
    });
  });
});
