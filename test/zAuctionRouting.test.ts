import * as zAuction from "@zero-tech/zauction-sdk";
import { expect } from "chai";
import * as ethers from "ethers";
import { zAuctionRoute } from "../src/types";
import { Config } from "..";
import { createZAuctionInstances, getZAuctionInstanceForDomain } from "../src/utilities/zAuctionRouting";

describe("zAuctionRouting", () => {
  const idToName: { [key: string]: string } = {
    "0x1": "wilder.world",
    "0x2": "bob",
  };

  const idToNameStub = async (id: string) => {
    return idToName[id];
  };

    // apiUri: "",
    // subgraphUri: "",
    // zAuctionAddress: "",
    // tokenContract: "",
    // web3Provider: ethers.providers.getDefaultProvider(),
  const dummyZAuctionConfig = {
    apiUri: "http",
    subgraphUri: "http",
    zAuctionAddress: "0x1",
    tokenContract: "http",
    web3Provider: ethers.providers.getDefaultProvider(),
  }

  const dummyConfig = {
    subgraphUri: "http",
    metricsUri: "http",
    apiUri: "http",
    zAuctionRoutes: [],
    basicController: "http",
    registrar: "http",
  } as Config

  createZAuctionInstances(dummyConfig);

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
        config: dummyZAuctionConfig as zAuction.Config,
      } as zAuctionRoute,
      {
        uriPattern: "",
        config: dummyZAuctionConfig as zAuction.Config,
      } as zAuctionRoute,
    ];

    dummyConfig.zAuctionRoutes = routes;
    const zAuctionRouteUriToInstance = createZAuctionInstances(dummyConfig);

    const instance: zAuction.Instance = await getZAuctionInstanceForDomain(
      "0x1",
      routes,
      zAuctionRouteUriToInstance,
      idToNameStub
    );
    // const instance = zAuction.createInstance();
    expect(JSON.stringify(instance)).to.eq(JSON.stringify(dummyInstance))
  });

  it("Returns default route", async () => {
    const routes = [
      {
        uriPattern: "wilder",
        config: dummyZAuctionConfig,
      } as zAuctionRoute,
      {
        uriPattern: "",
        config: dummyZAuctionConfig,
      } as zAuctionRoute,
    ];

    dummyConfig.zAuctionRoutes = routes;
    const zAuctionRouteUriToInstance = createZAuctionInstances(dummyConfig);

    const instance: zAuction.Instance = await getZAuctionInstanceForDomain(
      "0x2",
      routes,
      zAuctionRouteUriToInstance,
      idToNameStub
    );
    expect(JSON.stringify(instance)).to.eq(JSON.stringify(dummyInstance));
  });
});
