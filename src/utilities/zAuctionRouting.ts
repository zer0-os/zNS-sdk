import * as zAuction from "@zero-tech/zauction-sdk";
import { zAuctionRoute } from "../types";

type GetDomainNameFromIdFunction = (domainId: string) => Promise<string>;

export const getZAuctionInstanceForDomain = async (
  domainId: string,
  zAuctionRoutes: zAuctionRoute[],
  getDomainName: GetDomainNameFromIdFunction
): Promise<zAuction.Instance> => {
  const domainName = await getDomainName(domainId);

  for (const route of zAuctionRoutes) {
    const match = RegExp(`^${route.uriPattern}`).exec(domainName);
    if (match) {
      return route.instance;
    }
  }

  throw Error(`No zAuction Route configured for this domain!`);
};
