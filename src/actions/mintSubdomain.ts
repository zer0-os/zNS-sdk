import { ethers } from "ethers";
import { SubdomainParams } from "../types";
import {
  DomainMetadata,
  MintSubdomainStatusCallback,
  MintSubdomainStep,
} from "../types";

type RegisterSubdomainFunction = (
  parentId: string,
  label: string,
  owner: string,
  metadata: string,
  royaltyAmount: string,
  lockOnCreation: boolean
) => Promise<ethers.ContractTransaction>;

type UploadMediaFunction = (media: Buffer) => Promise<string>;

type UploadMetadataFunction = (metadata: DomainMetadata) => Promise<string>;

export const mintSubdomain = async (
  params: SubdomainParams,
  owner: string,
  registerSubdomain: RegisterSubdomainFunction,
  uploadMedia: UploadMediaFunction,
  uploadMetadata: UploadMetadataFunction,
  statusCallback?: MintSubdomainStatusCallback
): Promise<ethers.ContractTransaction> => {
  throw Error(`Currently broken from zNS v1.1`);

  // statusCallback ? statusCallback(MintSubdomainStep.UploadingImage) : null;

  // let imageUri: Maybe<string>;
  // try {
  //   imageUri = await uploadMedia(params.image);
  // } catch (e) {
  //   throw Error(`Failed to upload image: ${e}`);
  // }

  // let animationUri: Maybe<string>;
  // try {
  //   if (params.animation) {
  //     animationUri = await uploadMedia(params.animation);
  //   }
  // } catch (e) {
  //   throw Error(`Failed to upload preview image: ${e}`);
  // }

  // const metadata: DomainMetadata = {
  //   image: imageUri,
  //   animation_url: animationUri,
  //   description: params.description,
  //   name: params.name,
  //   isBiddable: false,
  //   stakingRequests: "disabled",
  //   gridViewByDefault: false,
  //   customDomainHeader: false,
  //   ...params.additionalMetadata,
  // };

  // statusCallback ? statusCallback(MintSubdomainStep.UploadingMetadata) : null;

  // let metadataUri: Maybe<string>;
  // try {
  //   metadataUri = await uploadMetadata(metadata);
  // } catch (e) {
  //   throw Error(`Failed to upload metadata: ${e}`);
  // }

  // statusCallback
  //   ? statusCallback(MintSubdomainStep.SubmittingTransaction)
  //   : null;

  // let tx: Maybe<ethers.ContractTransaction>;
  // try {
  //   tx = await registerSubdomain(
  //     params.parentId,
  //     params.label,
  //     owner,
  //     metadataUri,
  //     params.royaltyAmount,
  //     params.lockOnCreate
  //   );
  // } catch (e) {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   if ((e as any).code === 4001) {
  //     throw Error(`User rejected transaction.`);
  //   }

  //   throw Error(`Failed to submit transaction: ${e}`);
  // }

  // statusCallback ? statusCallback(MintSubdomainStep.Completed) : null;

  // return tx;
};
