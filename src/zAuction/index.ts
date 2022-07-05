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
    const bidCollection: zAuction.TokenBidCollection = await instance.listBids([
      domainId,
    ]);
    const bids: zAuction.Bid[] = bidCollection[domainId];

    const bidEvents = bids.map((e) => {
      const bidEvent: DomainBidEvent = {
        type: DomainEventType.bid,
        timestamp: e.timestamp,
        bidder: e.bidder,
        amount: e.amount,
        paymentToken: e.bidToken,
      };
      return bidEvent;
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
      const saleEvent: DomainSaleEvent = {
        type: DomainEventType.sale,
        timestamp: e.timestamp,
        buyer: e.buyer,
        seller: e.seller,
        amount: e.saleAmount,
        paymentToken: e.paymentToken,
        domainNetworkId: e.topLevelDomainId,
      };
      return saleEvent;
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
      const buyNowSaleEvent: DomainBuyNowSaleEvent = {
        type: DomainEventType.buyNow,
        timestamp: e.timestamp,
        buyer: e.buyer,
        seller: e.seller,
        amount: e.amount,
        paymentToken: e.paymentToken,
        domainNetworkId: e.topLevelDomainId,
      };
      return buyNowSaleEvent;
    });
    return buyNowSalesEvents;
  };
};
