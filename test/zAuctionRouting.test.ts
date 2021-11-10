import * as zAuction from "@zero-tech/zauction-sdk";
import { expect } from "chai";
import * as ethers from "ethers";
import { zAuctionRoute } from "../src/types";
import { getZAuctionInstanceForDomain } from "../src/utilities/zAuctionRouting";

describe("zAuctionRouting", () => {
  const idToName: { [key: string]: string } = {
    "0x1": "wilder.world",
    "0x2": "bob",
  };

  const idToNameStub = async (id: string) => {
    return idToName[id];
  };

  const dummyConfig1 = { foo: "1" } as unknown as zAuction.Config;
  const dummyConfig2 = { bar: "2" } as unknown as zAuction.Config;

  const dummyInstance = {
    listSales: () => {},
    listBids: (tokenIds: string[]) => {},
    listBidsByAccount: (account: string) => {},
    placeBid: (params: zAuction.NewBidParameters, signer: ethers.Signer, statusCallback?: zAuction.PlaceBidStatusCallback) => {},
    isZAuctionApprovedToTransferNft: (account: string) => {},
    getZAuctionSpendAllowance: (account: string) => {},
    getTradeTokenAddress: () => {},
    approveZAuctionSpendTradeTokens: (signer: ethers.Signer) => {},
    approveZAuctionTransferNft: (signer: ethers.Signer) => {},
    acceptBid: (bid: zAuction.Bid, signer: ethers.Signer) => {}
  } as unknown as zAuction.Instance;

  it("Returns the proper instance", async () => {
    const routes = [
      {
        uriPattern: "wilder",
        config: dummyConfig1 as zAuction.Config,
      } as zAuctionRoute,
      {
        uriPattern: "",
        config: dummyConfig2 as zAuction.Config,
      } as zAuctionRoute,
    ];

    const instance: zAuction.Instance = await getZAuctionInstanceForDomain(
      "0x1",
      routes,
      idToNameStub
    );
    
    expect(JSON.stringify(instance)).to.eq(JSON.stringify(dummyInstance))
  });

  it("Returns default route", async () => {
    const routes = [
      {
        uriPattern: "wilder",
        config: dummyConfig1,
      } as zAuctionRoute,
      {
        uriPattern: "",
        config: dummyConfig2,
      } as zAuctionRoute,
    ];

    const instance = await getZAuctionInstanceForDomain(
      "0x2",
      routes,
      idToNameStub
    );
    expect(JSON.stringify(instance)).to.eq(JSON.stringify(dummyInstance));
  });
});
