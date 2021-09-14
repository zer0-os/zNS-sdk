import * as zAuction from "@zero-tech/zauction-sdk";
import { expect } from "chai";
import { zAuctionRoute } from "../src";
import { getZAuctionInstanceForDomain } from "../src/utilities/zAuctionRouting";

describe("zAuctionRouting", () => {
  const idToName: { [key: string]: string } = {
    "0x1": "wilder.world",
    "0x2": "bob",
  };

  const idToNameStub = async (id: string) => {
    return idToName[id];
  };

  const dummyInstance1 = { foo: "1" } as unknown as zAuction.Instance;
  const dummyInstance2 = { bar: "2" } as unknown as zAuction.Instance;

  it("Returns the proper instance", async () => {
    const routes = [
      {
        uriPattern: "wilder",
        instance: dummyInstance1,
      } as zAuctionRoute,
      {
        uriPattern: "",
        instance: dummyInstance2,
      } as zAuctionRoute,
    ];

    const instance = await getZAuctionInstanceForDomain(
      "0x1",
      routes,
      idToNameStub
    );
    expect(instance).to.eq(dummyInstance1);
  });

  it("Returns default route", async () => {
    const routes = [
      {
        uriPattern: "wilder",
        instance: dummyInstance1,
      } as zAuctionRoute,
      {
        uriPattern: "",
        instance: dummyInstance2,
      } as zAuctionRoute,
    ];

    const instance = await getZAuctionInstanceForDomain(
      "0x2",
      routes,
      idToNameStub
    );
    expect(instance).to.eq(dummyInstance2);
  });
});
