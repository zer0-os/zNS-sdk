import { DomainEventType, DomainMintEvent, DomainTransferEvent } from "../src";
import { getDomainEvents } from "../src/actions";

import { expect } from "chai";
import Sinon from "sinon";

describe("getDomainEvents", () => {
  let mintEvent: DomainMintEvent = {
    type: DomainEventType.mint,
    timestamp: "100",
    minter: "0x2",
  };

  let transferEvents: DomainTransferEvent[] = [];

  it("Removes the first two transfer events if they have the same timestamp", async () => {
    transferEvents = [
      {
        type: DomainEventType.transfer,
        timestamp: "100",
        from: "0x0",
        to: "0x1",
      },
      {
        type: DomainEventType.transfer,
        timestamp: "100",
        from: "0x1",
        to: "0x2",
      },
    ];

    const events = await getDomainEvents(
      "testid",
      {
        getBidEvents: Sinon.fake.returns([]),
        getMintEvents: Sinon.fake.returns(mintEvent),
        getTransferEvents: Sinon.fake.returns(transferEvents);
        getSaleEvents: Sinon.fake.returns([])
      }
    );

    expect(events.length).eq(1);
  });

  it("Returns the proper number of events", async () => {
    transferEvents = [
      {
        type: DomainEventType.transfer,
        timestamp: "101",
        from: "0x0",
        to: "0x1",
      },
    ];

    const events = await getDomainEvents(
      "testid",
      {
        getBidEvents: Sinon.fake.returns([]),
        getMintEvents: Sinon.fake.returns(mintEvent),
        getTransferEvents: Sinon.fake.returns(transferEvents);
        getSaleEvents: Sinon.fake.returns([])
      }
    );

    expect(events.length).eq(2);
  });

  it("Sorts events in the proper order", async () => {
    mintEvent = {
      type: DomainEventType.mint,
      timestamp: "3",
      minter: "0x2",
    };

    transferEvents = [
      {
        type: DomainEventType.transfer,
        timestamp: "1",
        from: "0x0",
        to: "0x1",
      },
      {
        type: DomainEventType.transfer,
        timestamp: "2",
        from: "0x0",
        to: "0x1",
      },
    ];

    const events = await getDomainEvents(
      "testid",
      {
        getBidEvents: Sinon.fake.returns([]),
        getMintEvents: Sinon.fake.returns(mintEvent),
        getTransferEvents: Sinon.fake.returns(transferEvents);
        getSaleEvents: Sinon.fake.returns([])
      }
    );

    expect(events[1].timestamp).eq("2");
  });
});
