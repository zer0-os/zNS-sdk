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

interface StakingControllerInterface extends ethers.utils.Interface {
  functions: {
    "approveDomainRequest(uint256)": FunctionFragment;
    "calculateDomainId(uint256,string)": FunctionFragment;
    "domainData(uint256)": FunctionFragment;
    "fulfillDomainRequest(uint256,uint256,string,bool)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "placeDomainRequest(uint256,uint256,string,string)": FunctionFragment;
    "requestCount()": FunctionFragment;
    "requests(uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveDomainRequest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateDomainId",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "domainData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fulfillDomainRequest",
    values: [BigNumberish, BigNumberish, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "placeDomainRequest",
    values: [BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "requestCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requests",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveDomainRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateDomainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "domainData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "fulfillDomainRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "placeDomainRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "requests", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "DomainRequestApproved(uint256)": EventFragment;
    "DomainRequestFulfilled(uint256,string,address,uint256,uint256,uint256)": EventFragment;
    "DomainRequestPlaced(uint256,uint256,uint256,string,string,address,uint256)": EventFragment;
    "RequestWithdrawn(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DomainRequestApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DomainRequestFulfilled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DomainRequestPlaced"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestWithdrawn"): EventFragment;
}

export class StakingController extends BaseContract {
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

  interface: StakingControllerInterface;

  functions: {
    approveDomainRequest(
      requestId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    calculateDomainId(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    domainData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nonce: BigNumber; fulfilledRequest: BigNumber }
    >;

    fulfillDomainRequest(
      requestId: BigNumberish,
      royaltyAmount: BigNumberish,
      metadata: string,
      lockOnCreation: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _registrar: string,
      _infinity: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    placeDomainRequest(
      parentId: BigNumberish,
      offeredAmount: BigNumberish,
      name: string,
      requestUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    requestCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    requests(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string, string, boolean, BigNumber] & {
        parentId: BigNumber;
        offeredAmount: BigNumber;
        requester: string;
        requestedName: string;
        accepted: boolean;
        domainNonce: BigNumber;
      }
    >;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  approveDomainRequest(
    requestId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  calculateDomainId(
    parentId: BigNumberish,
    name: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  domainData(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nonce: BigNumber; fulfilledRequest: BigNumber }
  >;

  fulfillDomainRequest(
    requestId: BigNumberish,
    royaltyAmount: BigNumberish,
    metadata: string,
    lockOnCreation: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _registrar: string,
    _infinity: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  onERC721Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  placeDomainRequest(
    parentId: BigNumberish,
    offeredAmount: BigNumberish,
    name: string,
    requestUri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  requestCount(overrides?: CallOverrides): Promise<BigNumber>;

  requests(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, string, string, boolean, BigNumber] & {
      parentId: BigNumber;
      offeredAmount: BigNumber;
      requester: string;
      requestedName: string;
      accepted: boolean;
      domainNonce: BigNumber;
    }
  >;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    approveDomainRequest(
      requestId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    calculateDomainId(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nonce: BigNumber; fulfilledRequest: BigNumber }
    >;

    fulfillDomainRequest(
      requestId: BigNumberish,
      royaltyAmount: BigNumberish,
      metadata: string,
      lockOnCreation: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      _registrar: string,
      _infinity: string,
      overrides?: CallOverrides
    ): Promise<void>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    placeDomainRequest(
      parentId: BigNumberish,
      offeredAmount: BigNumberish,
      name: string,
      requestUri: string,
      overrides?: CallOverrides
    ): Promise<void>;

    requestCount(overrides?: CallOverrides): Promise<BigNumber>;

    requests(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string, string, boolean, BigNumber] & {
        parentId: BigNumber;
        offeredAmount: BigNumber;
        requester: string;
        requestedName: string;
        accepted: boolean;
        domainNonce: BigNumber;
      }
    >;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    DomainRequestApproved(
      requestId?: BigNumberish | null
    ): TypedEventFilter<[BigNumber], { requestId: BigNumber }>;

    DomainRequestFulfilled(
      requestId?: BigNumberish | null,
      name?: null,
      recipient?: null,
      domainId?: BigNumberish | null,
      parentID?: BigNumberish | null,
      domainNonce?: null
    ): TypedEventFilter<
      [BigNumber, string, string, BigNumber, BigNumber, BigNumber],
      {
        requestId: BigNumber;
        name: string;
        recipient: string;
        domainId: BigNumber;
        parentID: BigNumber;
        domainNonce: BigNumber;
      }
    >;

    DomainRequestPlaced(
      parentId?: BigNumberish | null,
      requestId?: BigNumberish | null,
      offeredAmount?: null,
      requestUri?: null,
      name?: null,
      requestor?: null,
      domainNonce?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, string, string, string, BigNumber],
      {
        parentId: BigNumber;
        requestId: BigNumber;
        offeredAmount: BigNumber;
        requestUri: string;
        name: string;
        requestor: string;
        domainNonce: BigNumber;
      }
    >;

    RequestWithdrawn(
      requestId?: BigNumberish | null
    ): TypedEventFilter<[BigNumber], { requestId: BigNumber }>;
  };

  estimateGas: {
    approveDomainRequest(
      requestId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    calculateDomainId(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fulfillDomainRequest(
      requestId: BigNumberish,
      royaltyAmount: BigNumberish,
      metadata: string,
      lockOnCreation: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _registrar: string,
      _infinity: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    placeDomainRequest(
      parentId: BigNumberish,
      offeredAmount: BigNumberish,
      name: string,
      requestUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    requestCount(overrides?: CallOverrides): Promise<BigNumber>;

    requests(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveDomainRequest(
      requestId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    calculateDomainId(
      parentId: BigNumberish,
      name: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    domainData(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fulfillDomainRequest(
      requestId: BigNumberish,
      royaltyAmount: BigNumberish,
      metadata: string,
      lockOnCreation: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _registrar: string,
      _infinity: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    placeDomainRequest(
      parentId: BigNumberish,
      offeredAmount: BigNumberish,
      name: string,
      requestUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    requestCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    requests(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}