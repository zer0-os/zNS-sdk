import * as subgraph from "./subgraph";
import * as api from "./api";
import * as actions from "./actions";
import * as zAuction from "./zAuction";
import {
  Config,
  DomainMetadata,
  Instance,
  IPFSGatewayUri,
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
import { ContractTransaction, ethers } from "ethers";
import { Registrar, ZNSHub } from "./contracts/types";
import { getBasicController, getHubContract } from "./contracts";

import * as domains from "./utilities/domains";
export { domains };

import * as configuration from "./configuration";
import { getDomainMetrics } from "./actions/getDomainMetrics";
import { getRegistrarForDomain } from "./helpers";

export * from "./types";
export { configuration };

const invalidInputMessage =
  "Please only make requests of up to 100 URLs at a time.";

export const createInstance = (config: Config): Instance => {
  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const apiClient = api.createClient(config.apiUri);

  const zAuctionRouteUriToInstance = createZAuctionInstances(config);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.name;
  };

  const getDomainContractForDomain = async (domainId: string) => {
    const domain = await subgraphClient.getDomainById(domainId);
    return domain.contract;
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
        domainIdToDomainName,
        getDomainContractForDomain
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
        domainIdToDomainName,
        getDomainContractForDomain
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
      const owner = params.owner ?? (await signer.getAddress());

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
    isDomainMetadataLocked: async (
      domainId: string,
      signer: ethers.Signer
    ): Promise<boolean> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);
      const registrar = await getRegistrarForDomain(hub, domainId);

      const isLocked = await registrar.isDomainMetadataLocked(domainId);

      return isLocked;
    },
    lockDomainMetadata: async (
      domainId: string,
      lockStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);

      const tx = await actions.lockDomainMetadata(
        domainId,
        lockStatus,
        signer,
        hub
      );

      return tx;
    },
    getDomainMetadata: async (
      domainId: string,
      signer: ethers.Signer
    ): Promise<DomainMetadata> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);
      const metadata = await actions.getDomainMetadata(
        domainId,
        hub,
        IPFSGatewayUri.fleek
      );
      return metadata;
    },
    getDomainMetadataUri: async (
      domainId: string,
      signer: ethers.Signer
    ): Promise<string> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);
      const registrar: Registrar = await getRegistrarForDomain(hub, domainId);
      const metadataUri = await registrar.tokenURI(domainId);
      return metadataUri;
    },
    setDomainMetadata: async (
      domainId: string,
      metadata: DomainMetadata,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);
      const tx = await actions.setDomainMetadata(
        domainId,
        metadata,
        apiClient,
        signer,
        hub
      );
      return tx;
    },
    setDomainMetadataUri: async (
      domainId: string,
      metadataUri: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);
      const tx = await actions.setDomainMetadataUri(
        domainId,
        metadataUri,
        signer,
        hub
      );
      return tx;
    },
    setAndLockDomainMetadata: async (
      domainId: string,
      metadata: DomainMetadata,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);

      const tx = await actions.setAndLockDomainMetadata(
        domainId,
        metadata,
        apiClient,
        signer,
        hub
      );
      return tx;
    },
    setAndLockDomainMetadataUri: async (
      domainId: string,
      metadataUri: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);

      const tx = await actions.setAndLockDomainMetadataUri(
        domainId,
        metadataUri,
        signer,
        hub
      );
      return tx;
    },
    setDomainRoyalty: async (
      domainId: string,
      amount: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);

      const tx = await actions.setDomainRoyalty(domainId, amount, signer, hub);
      return tx;
    },
    transferDomainOwnership: async (
      to: string,
      domainId: string,
      signer: ethers.Signer
    ): Promise<ContractTransaction> => {
      const hub: ZNSHub = await getHubContract(signer, config.hub);

      const tx = await actions.transferOwnership(to, domainId, signer, hub);
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
          domainIdToDomainName,
          getDomainContractForDomain
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
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const tx = await zAuctionInstance.approveZAuctionSpendTradeTokens(
          signer
        );

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
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const isApproved =
          await zAuctionInstance.isZAuctionApprovedToTransferNft(account);

        return isApproved;
      },

      needsToApproveZAuctionToTransferNftsByBid: async (
        domainId: string,
        account: string,
        bid: zAuction.Bid
      ): Promise<boolean> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const isApproved =
          await zAuctionInstance.isZAuctionApprovedToTransferNftByBid(
            account,
            bid
          );

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
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const tx = await zAuctionInstance.approveZAuctionTransferNft(signer);

        return tx;
      },

      approveZAuctionToTransferNftsByBid: async (
        domainId: string,
        bid: zAuction.Bid,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const tx = await zAuctionInstance.approveZAuctionTransferNftByBid(
          bid,
          signer
        );

        return tx;
      },

      placeBid: async (
        params: PlaceBidParams,
        signer: ethers.Signer,
        statusCallback?: zAuction.PlaceBidStatusCallback
      ): Promise<void> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          params.domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );

        await zAuctionInstance.placeBid(
          {
            tokenId: params.domainId,
            bidAmount: params.bidAmount.toString(), // perhaps changes this to ethers.BigNumber
          } as zAuction.NewBidParameters,
          signer,
          statusCallback
        );
      },

      cancelBid: async (
        bidNonce: string,
        signedBidMessage: string,
        domainId: string,
        cancelOnChain: boolean,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction | void> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const tx = await zAuctionInstance.cancelBid(
          bidNonce,
          signedBidMessage,
          cancelOnChain,
          signer
        );
        if (tx) return tx;
      },

      listBids: async (domainId: string): Promise<zAuction.Bid[]> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          domainId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const bidCollection = await zAuctionInstance.listBids([domainId]);
        const domainBids = bidCollection[domainId];

        return domainBids;
      },

      listBidsByAccount: async (account: string): Promise<zAuction.Bid[]> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          "0x0000000000000000000000000000000000000000000000000000000000000000", //Todo replace with cheese
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const bids = await zAuctionInstance.listBidsByAccount(account);
        return bids;
      },

      acceptBid: async (
        bid: zAuction.Bid,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          bid.tokenId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
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
          domainIdToDomainName,
          getDomainContractForDomain
        );

        const tx = await zAuctionInstance.buyNow(params, signer);
        return tx;
      },
      getBuyNowPrice: async (tokenId: string): Promise<string> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          tokenId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
        );
        const domain = await subgraphClient.getDomainById(tokenId);
        const listing: zAuction.Listing = await zAuctionInstance.getBuyNowPrice(
          tokenId
        );
        if (listing.holder.toLowerCase() !== domain.owner.toLowerCase())
          return "0";
        return ethers.utils.formatEther(listing.price);
      },
      setBuyNowPrice: async (
        params: zAuction.BuyNowParams,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const zAuctionInstance = await getZAuctionInstanceForDomain(
          params.tokenId,
          config.zAuctionRoutes,
          zAuctionRouteUriToInstance,
          domainIdToDomainName,
          getDomainContractForDomain
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
          domainIdToDomainName,
          getDomainContractForDomain
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

      startUrlUploadJob: (urls: string[]): Promise<UrlToJobId> => {
        if (urls.length > 100) {
          throw new Error(invalidInputMessage);
        }
        if (urls.length == 0) {
          return Promise.resolve<UrlToJobId>({});
        }
        return apiClient.startBulkUpload(urls);
      },

      checkBulkUploadJob: (jobIds: string[]): Promise<UploadJobStatus> => {
        if (jobIds.length > 100) {
          throw new Error(invalidInputMessage);
        }
        if (jobIds.length == 0) {
          return new Promise<UploadJobStatus>(() => {});
        }
        return apiClient.checkBulkUploadJob(jobIds);
      },

      checkUploadJob: (jobId: string): Promise<UploadJobStatus> => {
        return apiClient.checkBulkUploadJob([jobId]);
      },

      getMetadataFromUri: (
        metadataUri: string,
        gatewayOverride?: string
      ): Promise<DomainMetadata> => {
        return actions.getMetadataFromUri(
          metadataUri,
          IPFSGatewayUri.fleek,
          gatewayOverride
        );
      },
    },
  };

  return instance;
};
