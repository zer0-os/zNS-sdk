import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import * as zAuction from "@zero-tech/zauction-sdk";

import * as subgraph from "../src/subgraph";

import * as actions from "../src/actions";
import { Config, DomainMetadata, IPFSGatewayUri, Listing, zAuctionRoute } from "../src/types";
import { Registrar } from "../src/contracts/types";
import { getRegistrar } from "../src/contracts";
import { createClient } from "../src/api";
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
    42
  );

  const pk = process.env["PRIVATE_KEY"];
  if (!pk) throw Error("No private key");
  const signer = new ethers.Wallet(pk, provider);

  // Kovan zAuction
  const legacyZAuctionAddress = "0x18A804a028aAf1F30082E91d2947734961Dd7f89";
  const newZAuctionAddress = "0x646757a5F3C9eEB4C6Bd136fCefE655B4A8107e4";
  const registrarAddress = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";


  // Kovan config
  const config: Config = {
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns-kovan",
    apiUri: "https://zns.api.zero.tech/api",
    metricsUri: "https://zns-metrics-kovan.herokuapp.com",
    zAuctionRoutes: [
      {
        uriPattern: "wilder",
        // Use default values
        config: zAuctionConfiguration(
          provider,
          "kovan",
          undefined,
          undefined,
          newZAuctionAddress // override existing zAuction address
        ) as zAuction.Config,
      } as zAuctionRoute,
    ],
    basicController: "0x2EF34C52138781C901Fe9e50B64d80aA9903f730",
    registrar: "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931",
  };

  // Random wheels metadata qm hash
  const qmHash = "QmYTYkmSPGh4NLDMVtKcDTADnVD8HiCTVQKHMKNKQXD67n";
  const kovanDomainId =
    "0x7080e65e58e5fa0e2bacb7c947a817ef6d96832680d2c54e1373109380c121e1";

  const subgraphClient = subgraph.createClient(config.subgraphUri);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.name;
  };

  describe("getDomainMetadata", () => {
    it("runs as ipfs url", async () => {
      const mockRegistrar = {
        tokenURI: () => {
          return `ipfs://${qmHash}`;
        },
      } as unknown as Registrar;
      const metadata = await actions.getDomainMetadata(
        "0x1",
        mockRegistrar,
        IPFSGatewayUri.fleek
      );
      expect(metadata);
    });
    it("runs as well formed ipfs.fleek.co url", async () => {
      const mockRegistrar = {
        tokenURI: () => {
          return `https://ipfs.fleek.co/ipfs/${qmHash}`;
        },
      } as unknown as Registrar;
      const metadata = await actions.getDomainMetadata(
        "0x1",
        mockRegistrar,
        IPFSGatewayUri.fleek
      );
      expect(metadata);
    });
  });
  describe("setDomainMetadata", () => {
    it("runs setdomainMetadata", async () => {
      const metadata: DomainMetadata = {
        image: "image",
        animation_url: "animation_url",
        name: "My Domain",
        domain: "mydomain",
        description: "This is an example domain",
        stakingRequests: "disabled",
        isBiddable: false,
        gridViewByDefault: false,
        customDomainHeader: false,
        previewImage: "preview_image",
        customDomainHeaderValue: "custom_domain",
      };
      const registrar: Registrar = await getRegistrar(
        provider,
        registrarAddress
      );
      const apiUri = "https://zns.api.zero.tech/api";
      const client = createClient(apiUri);
      const tx = await actions.setDomainMetadata(
        kovanDomainId,
        metadata,
        client,
        signer,
        registrar
      );
      console.log(tx);
      const retrievedMetadata = await actions.getDomainMetadata(
        kovanDomainId,
        registrar,
        IPFSGatewayUri.fleek
      );
      expect(metadata).deep.equal(retrievedMetadata);
    });
  });
  describe("getBuyNowPrice", () => {
    it("runs as expected", async () => {
      const zAuctionRouteUriToInstance = createZAuctionInstances(config);

      const zAuctionInstance = await getZAuctionInstanceForDomain(
        kovanDomainId,
        config.zAuctionRoutes,
        zAuctionRouteUriToInstance,
        domainIdToDomainName
      );
      const listing: Listing = await zAuctionInstance.getBuyNowPrice(
        kovanDomainId,
        signer
      );
      console.log(listing);
    });
  });
});
