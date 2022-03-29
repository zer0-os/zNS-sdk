import * as zAuction from "@zero-tech/zauction-sdk";
import { zAuctionRoute, RouteUriToInstance } from "../types";
import { Config } from "..";

type GetDomainNameFromIdFunction = (domainId: string) => Promise<string>;
type GetDomainContractFromIdFunction = (domainId: string) => Promise<string>;

export const getZAuctionInstanceForDomain = async (
  domainId: string,
  zAuctionRoutes: zAuctionRoute[],
  routeUriToInstance: RouteUriToInstance,
  getDomainName: GetDomainNameFromIdFunction,
  getDomainContract: GetDomainContractFromIdFunction
): Promise<zAuction.Instance> => {
  const domainName = await getDomainName(domainId);

  for (const route of zAuctionRoutes) {
    const match = RegExp(`^${route.uriPattern}`).exec(domainName);
    if (match) {
      const routeInstances = routeUriToInstance[route.uriPattern];
      const tokenContract = await getDomainContract(domainId);
      let instance = routeInstances[tokenContract];
      if (!instance) {
        instance = zAuction.createInstance({
          ...route.config,
          tokenContract, // override token contract with the domains contract
        });
        routeInstances[tokenContract] = instance;
      }
      return instance;
    }
  }

  throw Error(`No zAuction Route configured for this domain!`);
};

export const createZAuctionInstances = (config: Config): RouteUriToInstance => {
  const routeUriToInstance: RouteUriToInstance = {};
  for (const route of config.zAuctionRoutes) {
    routeUriToInstance[route.uriPattern] = {};
  }
  return routeUriToInstance;
};
