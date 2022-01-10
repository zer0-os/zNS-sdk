import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";

import * as actions from "../src/actions";
import { DomainMetadata, IPFSGatewayUri } from "../src/types";
import { Registrar } from "../src/contracts/types";
import { getRegistrar } from "../src/contracts";
import { createClient } from "../src/api"

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"], 42)

  // Kovan registrar address
  const registrarAddress = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";

  const pk = process.env["PRIVATE_KEY"];
  if (!pk) throw Error("No private key");
  const signer = new ethers.Wallet(pk, provider);

  // Random wheels metadata qm hash
  const qmHash = "QmYTYkmSPGh4NLDMVtKcDTADnVD8HiCTVQKHMKNKQXD67n";

  describe("getDomainMetadata", () => {
    it("runs as ipfs url", async () => {
      const mockRegistrar = {
        tokenURI: () => { return `ipfs://${qmHash}` }
      } as unknown as Registrar;

      const metadata = await actions.getDomainMetadata("0x1", mockRegistrar, IPFSGatewayUri.fleek);
      expect(metadata);
    });
    it("runs as well formed ipfs.fleek.co url", async () => {
      const mockRegistrar = {
        tokenURI: () => { return `https://ipfs.fleek.co/ipfs/${qmHash}` }
      } as unknown as Registrar;

      const metadata = await actions.getDomainMetadata("0x1", mockRegistrar, IPFSGatewayUri.fleek);
      expect(metadata);
    })
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
      }

      const registrar: Registrar = await getRegistrar(provider, registrarAddress);
      const apiUri = "https://zns.api.zero.tech/api";
      const client = createClient(apiUri);

      const kovanDomain = "0x7080e65e58e5fa0e2bacb7c947a817ef6d96832680d2c54e1373109380c121e1"

      const tx = await actions.setDomainMetadata(
        kovanDomain,
        metadata,
        client,
        signer,
        registrar
      );
      console.log(tx);

      const retrievedMetadata = await actions.getDomainMetadata(
        kovanDomain,
        registrar,
        IPFSGatewayUri.fleek
      );
      expect(metadata).deep.equal(retrievedMetadata);
    });
  });
});
