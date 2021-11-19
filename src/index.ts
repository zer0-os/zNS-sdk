import * as subgraph from "./subgraph";
import * as api from "./api";
import * as actions from "./actions";
import * as zAuction from "./zAuction";
import {
  Config,
  Instance,
  InvalidInputMessage,
  MintSubdomainStatusCallback,
  PlaceBidParams,
  SubdomainParams,
  UploadJobStatus,
  UrlToJobId,
} from "./types";
import {
  getZAuctionInstanceForDomain,
  createZAuctionInstances,
} from "./utilities";
import { ethers } from "ethers";
import { Registrar } from "./contracts/types";
import { getBasicController, getRegistrar } from "./contracts";

import * as domains from "./utilities/domains";
import { Bid } from "./zAuction";
export { domains };

import * as configuration from "./configuration";
import { getDomainMetrics } from "./actions/getDomainMetrics";

export { Config, RouteUriToInstance } from "./types";
export { configuration };

const invalidInputMessage:InvalidInputMessage = {
  errorMessage: 'Please only make requests of 100 URLs at a time.'
};

export const createInstance = (config: Config): Instance => {
  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const apiClient = api.createClient(config.apiUri);

  const zAuctionRouteUriToInstance = createZAuctionInstances(config);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.name;
  };

  const listBids = async (domainId: string) => {
    const zAuctionInstance = await getZAuctionInstanceForDomain(
      domainId,
      config.zAuctionRoutes,
      zAuctionRouteUriToInstance,
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
        zAuctionRouteUriToInstance,
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
        zAuctionRouteUriToInstance,
        domainIdToDomainName
      ),
    getAllDomains: subgraphClient.getAllDomains,
    getDomainMetrics: async (domainIds: string[]) =>
      getDomainMetrics(config.metricsUri, domainIds),
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
    lockDomainMetadata: async (
      domainId: string,
      lockStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const registrar: Registrar = await getRegistrar(signer, config.registrar);

      const tx = await actions.lockDomainMetadata(
        domainId,
        lockStatus,
        registrar
      );

      return tx;
    },
    setDomainMetadata: async (
      domainId: string,
      metadataUri: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const registrar: Registrar = await getRegistrar(signer, config.registrar);

      const tx = await actions.setDomainMetadata(
        domainId,
        metadataUri,
        registrar
      );

      return tx;
    },
    setAndLockMetadata: async (
      domainId: string,
      metadataUri: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const registrar: Registrar = await getRegistrar(signer, config.registrar);

      const tx = await actions.setAndLockDomainMetadata(
        domainId,
        metadataUri,
        registrar
      );
      return tx;
    },
    setDomainRoyalty: async (
      domainId: string,
      amount: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const registrar: Registrar = await getRegistrar(signer, config.registrar);

      const tx = await actions.setDomainRoyalty(domainId, amount, registrar);
      return tx;
    },
    zauction: {
      needsToApproveZAuctionToSpendTokens: async (
        domainId: string,
        account: string,
        bidAmount: ethers.BigNumber
      ): Promise<boolean> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
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
          zAuctionRouteUriToInstance,
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
          zAuctionRouteUriToInstance,
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

      cancelBid: async (
        auctionId: string,
        domainId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.cancelBid(auctionId, signer);
        return tx;
      },

      needsToApproveZAuctionToTransferNfts: async (
        domainId: string,
        account: string
      ): Promise<boolean> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
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
          zAuctionRouteUriToInstance,
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
          zAuctionRouteUriToInstance,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.acceptBid(bid, signer);

        return tx;
      },
      // Awaiting zAuction-SDK PR to be merged, npm package to upgrade, then can uncomment
      buyNow: async (
        params: zAuction.BuyNowParams,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          params.tokenId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.buyNow(params, signer);
        return tx;
      },
      setBuyNowPrice: async (
        params: zAuction.BuyNowParams,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          params.tokenId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.setBuyNowPrice(params, signer);
        return tx;
      },
      cancelBuyNow: async (
        tokenId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          tokenId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName
        );

        const tx = await zAuctionInstance.cancelBuyNow(tokenId, signer);
        return tx;
      },
    },

    utility: {
      uploadMedia: async (media: Buffer): Promise<string> =>
        apiClient.uploadMedia(media),
      uploadObjectAsJson: async (
        object: Record<string, unknown>
      ): Promise<string> => apiClient.uploadObject(object),

      startUrlUploadJob: (urls: string[]): Promise<UrlToJobId[]> | InvalidInputMessage => {
        if(urls.length>100){
          return invalidInputMessage;
        }
        
        return apiClient.startBulkUpload(urls);
      },

      checkBulkUploadJob: (jobIds: string[]): Promise<UploadJobStatus[]> | InvalidInputMessage => {
        if(jobIds.length>100){
            return invalidInputMessage;
        }
        return apiClient.checkBulkUploadJob(jobIds);
      }
    },
  };

  return instance;
};
