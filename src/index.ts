import { BigNumber, ContractTransaction, ethers } from "ethers";
import * as zAuction from "@zero-tech/zauction-sdk";
import { getLogger } from "./utilities";
export const logger = getLogger().withTag("zns-sdk");
import * as subgraph from "./subgraph";
import * as api from "./api";
import * as actions from "./actions";
import {
  getBidEventsFunction,
  getSaleEventsFunction,
  getBuyNowSaleEventsFunction,
  BuyNowListing,
} from "./zAuction";
import {
  Config,
  ConvertedTokenInfo,
  Domain,
  DomainMetadata,
  Instance,
  IPFSGatewayUri,
  Maybe,
  MintSubdomainStatusCallback,
  PlaceBidParams,
  SubdomainParams,
  TokenAllowanceParams,
  UploadJobStatus,
  UrlToJobId,
} from "./types";
import { Registrar, ZNSHub } from "./contracts/types";
import {
  getBasicController,
  getDomainPurchaserContract,
  getERC20Contract,
  getHubContract,
} from "./contracts";
import * as domains from "./utilities/domains";
export { domains };

import * as configuration from "./configuration";
import { getDomainMetrics } from "./actions/getDomainMetrics";
import { getRegistrarForDomain } from "./helpers";
import { Bid } from "./zAuction";
import { DomainPurchaser } from "./contracts/types/DomainPurchaser";
import { ContentModerationResponse } from "./types";
import {
  DomainPurchaserConfig,
  NetworkDomainMintableConfig,
} from "./actions/minting/types";
import { DomainSortOptions } from "./api/dataStoreApi/types";

export * from "./types";
export { configuration };

const invalidInputMessage =
  "Please only make requests of up to 100 URLs at a time.";

export const createInstance = (config: Config): Instance => {
  logger.debug(`Creating instance of zNS SDK`);
  logger.debug(config);

  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const znsApiClient: api.znsApiClient = api.createZnsApiClient(
    config.znsUri,
    config.utilitiesUri
  );
  const dataStoreApiClient: api.DataStoreApiClient =
    api.createDataStoreApiClient(config.dataStoreUri);

  const zAuctionConfig: zAuction.Config = {
    ...config.zAuction,
  };

  const zAuctionSdkInstance: zAuction.Instance =
    zAuction.createInstance(zAuctionConfig);

  const listBidsBulk = async (
    domainIds: string[]
  ): Promise<zAuction.TokenBidCollection> => {
    const bidCollection = await zAuctionSdkInstance.listBids(domainIds);
    return bidCollection;
  };

  const instance: Instance = {
    getDomainById: async (domainId: string, useDataStoreAPI = true) => {
      let domain;
      if (useDataStoreAPI) {
        domain = await dataStoreApiClient.getDomainById(domainId);
      } else {
        domain = await subgraphClient.getDomainById(domainId);
      }
      return domain;
    },
    getDomainsByName: subgraphClient.getDomainsByName,
    getDomainsByOwner: async (
      ownerAddress: string,
      useDataStoreAPI = false,
      limit = 100,
      skip = 0,
      sort?: DomainSortOptions
    ) => {
      // Change default for `useDataStoreAPI` when bug is resolved for parity
      let domains: Domain[];
      if (useDataStoreAPI) {
        domains = await dataStoreApiClient.getDomainsByOwner(
          ownerAddress,
          limit,
          skip,
          sort
        );
      } else {
        domains = await subgraphClient.getDomainsByOwner(ownerAddress);
      }
      return domains;
    },
    getSubdomainsById: async (
      domainId: string,
      useDataStoreAPI = true,
      limit = 100,
      skip = 0,
      sort?: DomainSortOptions
    ): Promise<Domain[]> => {
      let domains: Domain[];
      if (useDataStoreAPI) {
        domains = await dataStoreApiClient.getSubdomainsById(
          domainId,
          limit,
          skip,
          sort
        );
      } else {
        domains = await subgraphClient.getSubdomainsById(domainId);
      }
      return domains;
    },
    getSubdomainsByIdDeep: async (
      domainId: string,
      limit = 100,
      skip = 0,
      sort?: DomainSortOptions
    ): Promise<Domain[]> => {
      const domains = await dataStoreApiClient.getSubdomainsByIdDeep(
        domainId,
        limit,
        skip,
        sort
      );

      return domains;
    },
    getMostRecentSubdomainsById: async (
      domainId: string,
      limit = 100,
      skip = 0,
      useDataStoreAPI = true
    ): Promise<Domain[]> => {
      let domains: Domain[];
      if (useDataStoreAPI) {
        domains = await dataStoreApiClient.getMostRecentSubdomainsById(
          domainId,
          limit,
          skip
        );
      } else {
        domains = await subgraphClient.getMostRecentSubdomainsById(
          domainId,
          limit,
          skip
        );
      }
      return domains;
    },
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
        znsApiClient.uploadMedia,
        znsApiClient.uploadMetadata,
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
        znsApiClient,
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
        znsApiClient,
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
      amount: BigNumber,
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
      ): Promise<ConvertedTokenInfo> => {
        const info = await actions.getPaymentTokenInfo(
          paymentTokenAddress,
          config
        );
        return info;
      },
      getUserBalanceForPaymentToken: async (
        account: string,
        paymentToken: string
      ) => {
        const contract = await getERC20Contract(config.provider, paymentToken);
        const balance = await contract.balanceOf(account);
        return balance;
      },
      getUserBalanceForPaymentTokenByDomain: async (
        account: string,
        domainId: string
      ) => {
        const paymentToken = await zAuctionSdkInstance.getPaymentTokenForDomain(
          domainId
        );
        const contract = await getERC20Contract(config.provider, paymentToken);
        const balance = await contract.balanceOf(account);
        return balance;
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
      ): Promise<BigNumber> => {
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
        bidAmount: BigNumber
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
          paymentTokenAddress
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
        const bidCollection = await listBidsBulk([domainId]);
        const domainBids = bidCollection[domainId];

        return domainBids;
      },
      listBidsBulk: listBidsBulk,
      listAllSales: async (): Promise<zAuction.TokenSaleCollection> => {
        const sales = await zAuctionSdkInstance.listAllSales();
        return sales;
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
      getBuyNowListing: async (
        tokenId: string
      ): Promise<Maybe<BuyNowListing>> => {
        const buyNowListing: Maybe<BuyNowListing> =
          await zAuctionSdkInstance.getBuyNowListing(tokenId);
        return buyNowListing;
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
        znsApiClient.uploadMedia(media),
      uploadObjectAsJson: async (
        object: Record<string, unknown>
      ): Promise<string> => znsApiClient.uploadObject(object),

      startUrlUploadJob: (urls: string[]): Promise<UrlToJobId> => {
        if (urls.length > 100) {
          throw new Error(invalidInputMessage);
        }
        if (urls.length == 0) {
          return Promise.resolve<UrlToJobId>({});
        }
        return znsApiClient.startBulkUpload(urls);
      },

      checkBulkUploadJob: (jobIds: string[]): Promise<UploadJobStatus> => {
        if (jobIds.length > 100) {
          throw new Error(invalidInputMessage);
        }
        if (jobIds.length == 0) {
          throw new Error(`no jobs`);
        }
        return znsApiClient.checkBulkUploadJob(jobIds);
      },

      checkUploadJob: (jobId: string): Promise<UploadJobStatus> => {
        return znsApiClient.checkBulkUploadJob([jobId]);
      },

      checkContentModeration: (
        text: string
      ): Promise<ContentModerationResponse> => {
        return znsApiClient.checkContentModeration(text);
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
    minting: {
      getPriceOfNetworkDomain: async (name: string): Promise<string> => {
        const purchaser: DomainPurchaser = await getDomainPurchaserContract(
          config.provider,
          config.domainPurchaser
        );
        return actions.getPriceOfNetworkDomain(name, purchaser);
      },
      isNetworkDomainAvailable: async (name: string): Promise<boolean> => {
        const hub: ZNSHub = await getHubContract(config.provider, config.hub);
        return actions.isNetworkDomainAvailable(name, hub, znsApiClient);
      },
      isMinterApprovedToSpendTokens: async (
        user: string,
        amount?: string
      ): Promise<boolean> => {
        const purchaser = await getDomainPurchaserContract(
          config.provider,
          config.domainPurchaser
        );
        const result = await actions.isMinterApprovedToSpendTokens(
          user,
          purchaser,
          amount
        );
        return result;
      },
      approveMinterToSpendTokens: async (
        signer: ethers.Signer,
        amount?: string
      ): Promise<ethers.ContractTransaction> => {
        const purchaser = await getDomainPurchaserContract(
          config.provider,
          config.domainPurchaser
        );
        const tokenAddress = await purchaser.paymentToken();
        const paymentToken = await getERC20Contract(
          config.provider,
          tokenAddress
        );

        const approvalAmount = amount ?? ethers.constants.MaxUint256;

        const tx = await paymentToken
          .connect(signer)
          .approve(config.domainPurchaser, approvalAmount);

        return tx;
      },
      getTokenSpendAllowance: async (user: string): Promise<BigNumber> => {
        const purchaser = await getDomainPurchaserContract(
          config.provider,
          config.domainPurchaser
        );
        const tokenAddress = await purchaser.paymentToken();
        const paymentToken = await getERC20Contract(
          config.provider,
          tokenAddress
        );
        const allowance = await actions.getTokenSpendAllowance(
          paymentToken,
          config.domainPurchaser,
          user
        );

        return allowance;
      },
      mintNetworkDomain: async (
        name: string,
        signer: ethers.Signer
      ): Promise<ContractTransaction> => {
        const hub: ZNSHub = await getHubContract(config.provider, config.hub);
        const purchaserConfig: DomainPurchaserConfig = {
          provider: config.provider,
          contractAddress: config.domainPurchaser,
        };
        const mintableConfig: NetworkDomainMintableConfig = {
          znsHub: hub,
          domainPurchaser: purchaserConfig,
          services: {
            apiClient: znsApiClient,
          },
        };
        const metadata = await actions.generateDefaultMetadata(
          znsApiClient,
          name
        );
        return await actions.mintNetworkDomain(
          name,
          mintableConfig,
          metadata,
          signer
        );
      },
    },
  };

  return instance;
};
