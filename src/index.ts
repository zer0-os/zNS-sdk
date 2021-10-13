import * as subgraph from "./subgraph";
import * as api from "./api";
import * as actions from "./actions";
import * as zAuction from "./zAuction";
import {
  Config,
  DomainMetadata,
  DomainTradingData,
  Instance,
  MintSubdomainStatusCallback,
  PlaceBidParams,
  SubdomainParams,
} from "./types";
import { getZAuctionInstanceForDomain } from "./utilities";
import { ethers } from "ethers";
import { getBasicController } from "./contracts";

export * from "./types";

import * as domains from "./utilities/domains";
import { Bid } from "./zAuction";
export { domains };

import * as configurations from "./configurations";
export { configurations };

export const createInstance = (config: Config): Instance => {
  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const apiClient = api.createClient(config.apiUri);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.name;
  };

  const listBids = async (domainId: string) => {
    const zAuctionInstance = await getZAuctionInstanceForDomain(
      domainId,
      config.zAuctionRoutes,
      domainIdToDomainName
    );

    const bidCollection = await zAuctionInstance.listBids([domainId]);
    const domainBids = bidCollection[domainId];

    return domainBids;
  };

  const instance: Instance = {
    getDomainById: subgraphClient.getDomainById,
    getDomainsByName: subgraphClient.getDomainsByName,
    getDomainsByOwner: subgraphClient.getDomainsByOwner,
    getSubdomainsById: subgraphClient.getSubdomainsById,
    getDomainEvents: async (domainId: string) => {
      const zAuctionInstance = await getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        domainIdToDomainName
      );

      return actions.getDomainEvents(domainId, {
        getMintEvents: subgraphClient.getDomainMintedEvent,
        getTransferEvents: subgraphClient.getDomainTransferEvents,
        getBidEvents: zAuction.getBidEventsFunction(zAuctionInstance),
        getSaleEvents: zAuction.getSaleEventsFunction(zAuctionInstance),
      });
    },
    getZAuctionInstanceForDomain: (domainId: string) =>
      getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        domainIdToDomainName
      ),
    getSubdomainTradingData: async (
      domainId: string
    ): Promise<DomainTradingData> => {
      const zAuctionInstance = await getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        domainIdToDomainName
      );

      const tradingData = await actions.getSubdomainTradingData(
        domainId,
        subgraphClient.getSubdomainsById,
        (domainId: string) => zAuctionInstance.listSales(domainId),
        listBids
      );
      return tradingData;
    },
    mintSubdomain: async (
      params: SubdomainParams,
      signer: ethers.Signer,
      statusCallback?: MintSubdomainStatusCallback
    ): Promise<ethers.ContractTransaction> => {
      const basicController = await getBasicController(
        signer,
        config.basicController
      );
      const owner = await signer.getAddress();

      const tx = await actions.mintSubdomain(
        params,
        owner,
        basicController.registerSubdomainExtended,
        apiClient.uploadMedia,
        apiClient.uploadMetadata,
        statusCallback
      );

      return tx;
    },

    bidding: {
      needsToApproveZAuctionToSpendTokens: async (
        domainId: string,
        account: string,
        bidAmount: ethers.BigNumber
      ): Promise<boolean> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          domainIdToDomainName
        );

        const allowance = await zAuctionInstance.getZAuctionSpendAllowance(
          account
        );
        const isApproved = allowance.gte(bidAmount);
        return isApproved;
      },
      approveZAuctionToSpendTokens: async (
        domainId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.approveZAuctionSpendTradeTokens(
          signer
        );

        return tx;
      },
      placeBid: async (
        params: PlaceBidParams,
        signer: ethers.Signer
      ): Promise<void> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          params.domainId,
          config.zAuctionRoutes,
          domainIdToDomainName
        );

        await zAuctionInstance.placeBid(
          {
            tokenId: params.domainId,
            bidAmount: params.bidAmount.toString(), // perhaps changes this to ethers.BigNumber
          } as zAuction.NewBidParameters,
          signer
        );
      },
      needsToApproveZAuctionToTransferNfts: async (
        domainId: string,
        account: string
      ): Promise<boolean> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          domainIdToDomainName
        );

        const isApproved =
          await zAuctionInstance.isZAuctionApprovedToTransferNft(account);

        return isApproved;
      },
      approveZAuctionToTransferNfts: async (
        domainId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.approveZAuctionTransferNft(signer);

        return tx;
      },
      acceptBid: async (
        bid: Bid,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          bid.tokenId,
          config.zAuctionRoutes,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.acceptBid(bid, signer);

        return tx;
      },
    },

    utility: {
      uploadMedia: async (media: Buffer): Promise<string> =>
        apiClient.uploadMedia(media),
      uploadObjectAsJson: async (
        object: Record<string, unknown>
      ): Promise<string> => apiClient.uploadObject(object),
    },
  };

  return instance;
};
