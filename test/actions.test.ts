import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { ImportMock } from "ts-mock-imports";

import * as actions from "../src/actions";
import { IPFSGatewayUri } from "../src/types";
import { Registrar } from "../src/contracts/types";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {

  // Dummy address pulled from Ethers VoidSigner docs
  const staker = new ethers.VoidSigner("0x8ba1f109551bD432803012645Ac136ddd64DBA72")
  // Random wheels metadata qm hash
  const qmHash = "QmYTYkmSPGh4NLDMVtKcDTADnVD8HiCTVQKHMKNKQXD67n";

  describe("getDomainMetadata", () => {
    it("runs as ipfs url", async () => {
      const mockRegistrar = {
        tokenURI: () => { return `ipfs://${qmHash}` }
      } as unknown as Registrar;

      const metadata = await actions.getDomainMetadata("0x1", mockRegistrar, IPFSGatewayUri.fleek);
      console.log(metadata)
      expect(metadata);
    });
    it("runs as well formed ipfs.fleek.co url", async () => {
      const mockRegistrar = {
        tokenURI: () => { return `https://ipfs.fleek.co/ipfs/${qmHash}` }
      } as unknown as Registrar;

      const metadata = await actions.getDomainMetadata("0x1", mockRegistrar, IPFSGatewayUri.fleek);
      console.log(metadata)
      expect(metadata);
    })
  });

});