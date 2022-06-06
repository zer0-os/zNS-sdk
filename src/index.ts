import { ContractTransaction, ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";
import CoinGecko from "coingecko-api";

import { getLogger } from "./utilities";
export const logger = getLogger().withTag("zns-sdk");

import * as subgraph from "./subgraph";
import * as api from "./api";
import * as actions from "./actions";
import {
  getBidEventsFunction,
  getSaleEventsFunction,
  getBuyNowSaleEventsFunction,
} from "./zAuction";
import {
  Config,
  ContentModerationResponse,
  DomainMetadata,
  Instance,
  IPFSGatewayUri,
  MintSubdomainStatusCallback,
  PlaceBidParams,
  SubdomainParams,
  TokenAllowanceParams,
  TokenPriceInfo,
  UploadJobStatus,
  UrlToJobId,
} from "./types";
import { Registrar, ZNSHub } from "./contracts/types";
import { getBasicController, getHubContract } from "./contracts";

import * as domains from "./utilities/domains";
export { domains };

import * as configuration from "./configuration";
import { getDomainMetrics } from "./actions/getDomainMetrics";
import { getRegistrarForDomain } from "./helpers";
import { Bid } from "./zAuction";

export * from "./types";
export { configuration };

const invalidInputMessage =
  "Please only make requests of up to 100 URLs at a time.";

export const createInstance = (config: Config): Instance => {
  logger.debug(`Creating instance of zNS SDK`);
  logger.debug(config);

  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const apiClient = api.createClient(config.apiUri, config.utilitiesUri);

  const zAuctionConfig: zAuction.Config = {
    ...config.zAuction,
  };

  const zAuctionSdkInstance: zAuction.Instance =
    zAuction.createInstance(zAuctionConfig);

  const instance: Instance = {
    getDomainById: subgraphClient.getDomainById,
    getDomainsByName: subgraphClient.getDomainsByName,
    getDomainsByOwner: subgraphClient.getDomainsByOwner,
    getSubdomainsById: subgraphClient.getSubdomainsById,
    getMostRecentSubdomainsById: subgraphClient.getMostRecentSubdomainsById,
    getMostRecentDomains: subgraphClient.getMostRecentDomains,
    getDomainEvents: async (domainId: string) => {
      return actions.getDomainEvents(domainId, {
        getMintEvents: subgraphClient.getDomainMintedEvent,
        getTransferEvents: subgraphClient.getDomainTransferEvents,
        getBidEvents: getBidEventsFunction(zAuctionSdkInstance),
        getSaleEvents: getSaleEventsFunction(zAuctionSdkInstance),
        getBuyNowSaleEvents: getBuyNowSaleEventsFunction(zAuctionSdkInstance),
      });
    },
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
    isDomainMetadataLocked: async (domainId: string): Promise<boolean> => {
      const hub: ZNSHub = await getHubContract(config.provider, config.hub);
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
    getDomainMetadata: async (domainId: string): Promise<DomainMetadata> => {
      const hub: ZNSHub = await getHubContract(config.provider, config.hub);
      const metadata = await actions.getDomainMetadata(
        domainId,
        hub,
        IPFSGatewayUri.infura // hot fix
      );
      return metadata;
    },
    getDomainMetadataUri: async (domainId: string): Promise<string> => {
      const hub: ZNSHub = await getHubContract(config.provider, config.hub);
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
      getPaymentTokenInfo: async (
        paymentTokenAddress: string
      ): Promise<TokenPriceInfo> => {
        const info: TokenPriceInfo = await actions.getPaymentTokenInfo(
          paymentTokenAddress,
          config
        );
        return info;
      },
      setPaymentTokenForDomain: async (
        networkId: string,
        paymentTokenAddress: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await actions.setPaymentTokenForDomain(
          networkId,
          paymentTokenAddress,
          signer,
          config,
          zAuctionSdkInstance
        );
        return tx;
      },
      getPaymentTokenForDomain: async (domainId): Promise<string> => {
        const paymentToken = await zAuctionSdkInstance.getPaymentTokenForDomain(
          domainId
        );
        return paymentToken;
      },
      getZAuctionSpendAllowance: async (
        account: string,
        params: TokenAllowanceParams
      ): Promise<ethers.BigNumber> => {
        const allowance = await actions.getZauctionSpendAllowance(
          account,
          params,
          zAuctionSdkInstance
        );
        return allowance;
      },
      needsToApproveZAuctionToSpendTokensByBid: async (
        account: string,
        bid: zAuction.Bid
      ): Promise<boolean> => {
        const allowance =
          await zAuctionSdkInstance.getZAuctionSpendAllowanceByBid(
            account,
            bid
          );
        const needsToApprove = allowance.lt(bid.amount);
        return needsToApprove;
      },
      needsToApproveZAuctionToSpendTokensByDomain: async (
        account: string,
        domainId: string,
        bidAmount: ethers.BigNumber
      ): Promise<boolean> => {
        const allowance =
          await zAuctionSdkInstance.getZAuctionSpendAllowanceByDomain(
            account,
            domainId
          );
        const needsToApprove = allowance.lt(bidAmount);
        return needsToApprove;
      },
      needsToApproveZAuctionToSpendTokensByPaymentToken: async (
        account: string,
        paymentTokenAddress: string,
        amount: string
      ): Promise<boolean> => {
        const allowance = await zAuctionSdkInstance.getZAuctionSpendAllowance(
          account,
          paymentTokenAddress,
        );
        const needsToApprove = allowance.lt(amount);
        return needsToApprove;
      },
      approveZAuctionToSpendTokensByBid: async (
        bid: Bid,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx =
          await zAuctionSdkInstance.approveZAuctionSpendPaymentTokenByBid(
            bid,
            signer
          );

        return tx;
      },
      approveZAuctionToSpendTokensByDomain: async (
        domainId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx =
          await zAuctionSdkInstance.approveZAuctionSpendPaymentTokenByDomain(
            domainId,
            signer
          );

        return tx;
      },
      approveZAuctionToSpendPaymentToken: async (
        paymentTokenAddress: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.approveZAuctionSpendPaymentToken(
          paymentTokenAddress,
          signer
        );

        return tx;
      },
      needsToApproveZAuctionToTransferNftsByDomain: async (
        domainId: string,
        account: string
      ): Promise<boolean> => {
        const isApproved =
          await zAuctionSdkInstance.isZAuctionApprovedToTransferNftByDomain(
            account,
            domainId
          );

        // If they are approved, return false because they do not need to approve
        return !isApproved;
      },
      needsToApproveZAuctionToTransferNftsByBid: async (
        account: string,
        bid: Bid
      ): Promise<boolean> => {
        const isApproved =
          await zAuctionSdkInstance.isZAuctionApprovedToTransferNftByBid(
            account,
            bid
          );
        // If they are approved, return false because they do not need to approve
        return !isApproved;
      },
      approveZAuctionToTransferNftsByDomain: async (
        domainId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.approveZAuctionTransferNftByDomain(
          domainId,
          signer
        );
        return tx;
      },
      approveZAuctionToTransferNftsByBid: async (
        bid: Bid,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.approveZAuctionTransferNftByBid(
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
        await zAuctionSdkInstance.placeBid(
          {
            tokenId: params.domainId,
            bidAmount: params.bidAmount.toString(),
          } as zAuction.NewBidParameters,
          signer,
          statusCallback
        );
      },
      cancelBid: async (
        bid: Bid,
        cancelOnChain: boolean,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction | void> => {
        const tx = await zAuctionSdkInstance.cancelBid(
          bid,
          cancelOnChain,
          signer
        );
        if (tx) return tx;
      },
      listBids: async (domainId: string): Promise<zAuction.Bid[]> => {
        const bidCollection = await zAuctionSdkInstance.listBids([domainId]);
        const domainBids = bidCollection[domainId];

        return domainBids;
      },
      listBidsByAccount: async (account: string): Promise<zAuction.Bid[]> => {
        const bids = await zAuctionSdkInstance.listBidsByAccount(account);
        return bids;
      },
      acceptBid: async (
        bid: Bid,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.acceptBid(bid, signer);
        return tx;
      },
      buyNow: async (
        params: zAuction.BuyNowParams,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.buyNow(params, signer);
        return tx;
      },
      getBuyNowPrice: async (tokenId: string): Promise<string> => {
        const buyNowListing = await zAuctionSdkInstance.getBuyNowListing(tokenId);
        return ethers.utils.formatEther(buyNowListing.price);
      },
      setBuyNowPrice: async (
        params: zAuction.BuyNowParams,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.setBuyNowPrice(params, signer);
        return tx;
      },
      cancelBuyNow: async (
        tokenId: string,
        signer: ethers.Signer
      ): Promise<ethers.ContractTransaction> => {
        const tx = await zAuctionSdkInstance.cancelBuyNow(tokenId, signer);
        return tx;
      },
    },

    utility: {
      getDomainContractForDomain: async (domainId: string): Promise<string> => {
        const domain = await subgraphClient.getDomainById(domainId);
        return domain.contract;
      },
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
          throw new Error(`no jobs`);
        }
        return apiClient.checkBulkUploadJob(jobIds);
      },

      checkUploadJob: (jobId: string): Promise<UploadJobStatus> => {
        return apiClient.checkBulkUploadJob([jobId]);
      },

      checkContentModeration: (text: string): Promise<ContentModerationResponse> => {
        return apiClient.checkContentModeration(text);
      },

      getMetadataFromUri: (
        metadataUri: string,
        gatewayOverride?: string
      ): Promise<DomainMetadata> => {
        return actions.getMetadataFromUri(
          metadataUri,
          IPFSGatewayUri.ipfs,
          gatewayOverride
        );
      },
    },
  };

  return instance;
};
