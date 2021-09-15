import {
  DomainBidEvent,
  DomainEvent,
  DomainMintEvent,
  DomainSaleEvent,
  DomainTransferEvent,
} from "../types";

type GetMintEvent = (domainId: string) => Promise<DomainMintEvent>;
type GetTransferEvents = (domainId: string) => Promise<DomainTransferEvent[]>;
type GetBidEvents = (domainId: string) => Promise<DomainBidEvent[]>;
type GetSaleEvents = (domainId: string) => Promise<DomainSaleEvent[]>;

export interface DomainEventFetchers {
  getMintEvents: GetMintEvent;
  getTransferEvents: GetTransferEvents;
  getBidEvents: GetBidEvents;
  getSaleEvents: GetSaleEvents;
}

/**
 * Returns a list of all events for a domain
 * @param domainId The domain id to get the events for
 * @param getMintEvents A function that will return the mint event
 * @param getTransferEvents A function that will return all transfer events for a domain
 * @returns
 */
export const getDomainEvents = async (
  domainId: string,
  fetchers: DomainEventFetchers
): Promise<DomainEvent[]> => {
  let events: DomainEvent[] = [];

  const mintEvent = await fetchers.getMintEvents(domainId);
  const transferEvents = await fetchers.getTransferEvents(domainId);

  /**
   * If the first two transfer events are on the same block it means that it was
   * a transfer to the controller, then to the minter.
   * This will be represented by the mint event so we can just disregard that event.
   */
  if (transferEvents.length >= 2) {
    if (transferEvents[0].timestamp === transferEvents[1].timestamp) {
      transferEvents.splice(0, 2);
    }
  }

  const saleEvents = await fetchers.getSaleEvents(domainId);
  const bidEvents = await fetchers.getBidEvents(domainId);

  events = [mintEvent];
  events = events.concat(transferEvents, saleEvents, bidEvents);

  events = events.sort((a, b) => {
    return Number(a.timestamp) - Number(b.timestamp);
  });

  return events;
};
