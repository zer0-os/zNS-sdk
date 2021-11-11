import * as zAuction from "@zero-tech/zauction-sdk";
import { zAuctionRoute, RouteUriToInstance } from "../types";
import { Config } from "..";

type GetDomainNameFromIdFunction = (domainId: string) => Promise<string>;

const zAuctionRouteUriToInstance: RouteUriToInstance = {};

export const getZAuctionInstanceForDomain = async (
  domainId: string,
  zAuctionRoutes: zAuctionRoute[],
  getDomainName: GetDomainNameFromIdFunction
): Promise<zAuction.Instance> => {
  const domainName = await getDomainName(domainId);

  for (const route of zAuctionRoutes) {
    const match = RegExp(`^${route.uriPattern}`).exec(domainName);
    if (match) {

      return getInstanceByRouteUri(route.uriPattern);
    }
  }

  throw Error(`No zAuction Route configured for this domain!`);
};

export const createZAuctionInstances = (config: Config) => {
  for (const route of config.zAuctionRoutes) {
    zAuctionRouteUriToInstance[route.uriPattern] = zAuction.createInstance(route.config)
  }
}

export const getInstanceByRouteUri = (routeUri: string) => {
  return zAuctionRouteUriToInstance[routeUri];
} 