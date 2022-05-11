import * as zAuction from "@zero-tech/zauction-sdk";
import {
  DomainBidEvent,
  DomainEventType,
  DomainSaleEvent,
  DomainBuyNowSaleEvent,
} from "../types";
export * from "@zero-tech/zauction-sdk";

type GetBidEventsFunction = (domainId: string) => Promise<DomainBidEvent[]>;
type GetSaleEventsFunction = (domainId: string) => Promise<DomainSaleEvent[]>;
type GetBuyNowSaleEventsFunction = (
  DomainId: string
) => Promise<DomainBuyNowSaleEvent[]>;

export const getBidEventsFunction = (
  instance: zAuction.Instance
): GetBidEventsFunction => {
  return async (domainId: string): Promise<DomainBidEvent[]> => {
    const bidCollection = await instance.listBids([domainId]);
    const bids = bidCollection[domainId];

    const bidEvents = bids.map((e) => {
      return {
        type: DomainEventType.bid,
        timestamp: e.timestamp,
        bidder: e.bidder,
        amount: e.amount,
      } as DomainBidEvent;
    });

    return bidEvents;
  };
};

export const getSaleEventsFunction = (
  instance: zAuction.Instance
): GetSaleEventsFunction => {
  return async (domainId: string): Promise<DomainSaleEvent[]> => {
    const sales = await instance.listSales(domainId);
    const saleEvents = sales.map((e) => {
      return {
        type: DomainEventType.sale,
        timestamp: e.timestamp,
        buyer: e.buyer,
        seller: e.seller,
        amount: e.saleAmount,
      } as DomainSaleEvent;
    });

    return saleEvents;
  };
};

export const getBuyNowSaleEventsFunction = (
  instance: zAuction.Instance
): GetBuyNowSaleEventsFunction => {
  return async (domainId): Promise<DomainBuyNowSaleEvent[]> => {
    const buyNowSales = await instance.listBuyNowSales(domainId);
    const buyNowSalesEvents = buyNowSales.map((e) => {
      return {
        type: DomainEventType.buyNow,
        timestamp: e.timestamp,
        buyer: e.buyer,
        seller: e.seller,
        amount: e.amount,
      } as DomainBuyNowSaleEvent;
    });
    return buyNowSalesEvents;
  };
};
