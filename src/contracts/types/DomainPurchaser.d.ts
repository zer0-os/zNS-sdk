/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface DomainPurchaserInterface extends ethers.utils.Interface {
  functions: {
    "getDomainPrice(uint256,string)": FunctionFragment;
    "initialize(address,address,address,tuple,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "paymentToken()": FunctionFragment;
    "platformFee()": FunctionFragment;
    "platformWallet()": FunctionFragment;
    "purchaseData(uint256)": FunctionFragment;
    "purchaseSubdomain(uint256,string,string)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setDomainMintingStatus(uint256,bool,bool)": FunctionFragment;
    "setDomainPricing(uint256,tuple,bool,bool)": FunctionFragment;
    "setNonNetworkDomainMinting(bool)": FunctionFragment;
    "setPlatformFee(uint256)": FunctionFragment;
    "setPlatformWallet(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "zNSHub()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getDomainPrice",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      string,
      string,
      string,
      { short: BigNumberish; medium: BigNumberish; long: BigNumberish },
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "paymentToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "platformFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "platformWallet",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "purchaseData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "purchaseSubdomain",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setDomainMintingStatus",
    values: [BigNumberish, boolean, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setDomainPricing",
    values: [
      BigNumberish,
      { short: BigNumberish; medium: BigNumberish; long: BigNumberish },
      boolean,
      boolean
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setNonNetworkDomainMinting",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setPlatformFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPlatformWallet",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "zNSHub", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getDomainPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "paymentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "platformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "platformWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "purchaseData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "purchaseSubdomain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDomainMintingStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDomainPricing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNonNetworkDomainMinting",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPlatformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPlatformWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "zNSHub", data: BytesLike): Result;

  events: {
    "AllowSubdomainsToMintSet(uint256,bool)": EventFragment;
    "NetworkPurchased(uint256,address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "SubdomainMintingSet(uint256,bool)": EventFragment;
    "SubdomainPricingSet(uint256,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AllowSubdomainsToMintSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NetworkPurchased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SubdomainMintingSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SubdomainPricingSet"): EventFragment;
}

export class DomainPurchaser extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: DomainPurchaserInterface;

  functions: {
    getDomainPrice(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(
      _paymentToken: string,
      _zNSHub: string,
      _platformWallet: string,
      _rootPrices: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      _platformFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paymentToken(overrides?: CallOverrides): Promise<[string]>;

    platformFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    platformWallet(overrides?: CallOverrides): Promise<[string]>;

    purchaseData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        boolean,
        [BigNumber, BigNumber, BigNumber] & {
          short: BigNumber;
          medium: BigNumber;
          long: BigNumber;
        },
        boolean,
        boolean
      ] & {
        subdomainMintingEnabled: boolean;
        prices: [BigNumber, BigNumber, BigNumber] & {
          short: BigNumber;
          medium: BigNumber;
          long: BigNumber;
        };
        allowSubdomainsToMint: boolean;
        wasAllowedToSubdomainMintOnCreation: boolean;
      }
    >;

    purchaseSubdomain(
      parentId: BigNumberish,
      name: string,
      metadataUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDomainMintingStatus(
      domainId: BigNumberish,
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDomainPricing(
      domainId: BigNumberish,
      pricing: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setNonNetworkDomainMinting(
      allowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPlatformFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPlatformWallet(
      wallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    zNSHub(overrides?: CallOverrides): Promise<[string]>;
  };

  getDomainPrice(
    parentId: BigNumberish,
    name: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    _paymentToken: string,
    _zNSHub: string,
    _platformWallet: string,
    _rootPrices: {
      short: BigNumberish;
      medium: BigNumberish;
      long: BigNumberish;
    },
    _platformFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  paymentToken(overrides?: CallOverrides): Promise<string>;

  platformFee(overrides?: CallOverrides): Promise<BigNumber>;

  platformWallet(overrides?: CallOverrides): Promise<string>;

  purchaseData(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      boolean,
      [BigNumber, BigNumber, BigNumber] & {
        short: BigNumber;
        medium: BigNumber;
        long: BigNumber;
      },
      boolean,
      boolean
    ] & {
      subdomainMintingEnabled: boolean;
      prices: [BigNumber, BigNumber, BigNumber] & {
        short: BigNumber;
        medium: BigNumber;
        long: BigNumber;
      };
      allowSubdomainsToMint: boolean;
      wasAllowedToSubdomainMintOnCreation: boolean;
    }
  >;

  purchaseSubdomain(
    parentId: BigNumberish,
    name: string,
    metadataUri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDomainMintingStatus(
    domainId: BigNumberish,
    subdomainMintingEnabled: boolean,
    allowSubdomainsToMint: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDomainPricing(
    domainId: BigNumberish,
    pricing: { short: BigNumberish; medium: BigNumberish; long: BigNumberish },
    subdomainMintingEnabled: boolean,
    allowSubdomainsToMint: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setNonNetworkDomainMinting(
    allowed: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPlatformFee(
    fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPlatformWallet(
    wallet: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  zNSHub(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getDomainPrice(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _paymentToken: string,
      _zNSHub: string,
      _platformWallet: string,
      _rootPrices: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      _platformFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    paymentToken(overrides?: CallOverrides): Promise<string>;

    platformFee(overrides?: CallOverrides): Promise<BigNumber>;

    platformWallet(overrides?: CallOverrides): Promise<string>;

    purchaseData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        boolean,
        [BigNumber, BigNumber, BigNumber] & {
          short: BigNumber;
          medium: BigNumber;
          long: BigNumber;
        },
        boolean,
        boolean
      ] & {
        subdomainMintingEnabled: boolean;
        prices: [BigNumber, BigNumber, BigNumber] & {
          short: BigNumber;
          medium: BigNumber;
          long: BigNumber;
        };
        allowSubdomainsToMint: boolean;
        wasAllowedToSubdomainMintOnCreation: boolean;
      }
    >;

    purchaseSubdomain(
      parentId: BigNumberish,
      name: string,
      metadataUri: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setDomainMintingStatus(
      domainId: BigNumberish,
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setDomainPricing(
      domainId: BigNumberish,
      pricing: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setNonNetworkDomainMinting(
      allowed: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setPlatformFee(fee: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setPlatformWallet(wallet: string, overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    zNSHub(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    AllowSubdomainsToMintSet(
      domainId?: null,
      enabled?: null
    ): TypedEventFilter<
      [BigNumber, boolean],
      { domainId: BigNumber; enabled: boolean }
    >;

    NetworkPurchased(
      networkDomainId?: null,
      owner?: null
    ): TypedEventFilter<
      [BigNumber, string],
      { networkDomainId: BigNumber; owner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    SubdomainMintingSet(
      domainId?: null,
      enabled?: null
    ): TypedEventFilter<
      [BigNumber, boolean],
      { domainId: BigNumber; enabled: boolean }
    >;

    SubdomainPricingSet(
      domainId?: null,
      pricing?: null
    ): TypedEventFilter<
      [
        BigNumber,
        [BigNumber, BigNumber, BigNumber] & {
          short: BigNumber;
          medium: BigNumber;
          long: BigNumber;
        }
      ],
      {
        domainId: BigNumber;
        pricing: [BigNumber, BigNumber, BigNumber] & {
          short: BigNumber;
          medium: BigNumber;
          long: BigNumber;
        };
      }
    >;
  };

  estimateGas: {
    getDomainPrice(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _paymentToken: string,
      _zNSHub: string,
      _platformWallet: string,
      _rootPrices: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      _platformFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paymentToken(overrides?: CallOverrides): Promise<BigNumber>;

    platformFee(overrides?: CallOverrides): Promise<BigNumber>;

    platformWallet(overrides?: CallOverrides): Promise<BigNumber>;

    purchaseData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    purchaseSubdomain(
      parentId: BigNumberish,
      name: string,
      metadataUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDomainMintingStatus(
      domainId: BigNumberish,
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDomainPricing(
      domainId: BigNumberish,
      pricing: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setNonNetworkDomainMinting(
      allowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPlatformFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPlatformWallet(
      wallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    zNSHub(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getDomainPrice(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _paymentToken: string,
      _zNSHub: string,
      _platformWallet: string,
      _rootPrices: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      _platformFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paymentToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    platformFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    platformWallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    purchaseData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    purchaseSubdomain(
      parentId: BigNumberish,
      name: string,
      metadataUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDomainMintingStatus(
      domainId: BigNumberish,
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDomainPricing(
      domainId: BigNumberish,
      pricing: {
        short: BigNumberish;
        medium: BigNumberish;
        long: BigNumberish;
      },
      subdomainMintingEnabled: boolean,
      allowSubdomainsToMint: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setNonNetworkDomainMinting(
      allowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPlatformFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPlatformWallet(
      wallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    zNSHub(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}