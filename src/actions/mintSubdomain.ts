import { ethers } from "ethers";
import { SubdomainParams } from "..";
import {
  DomainMetadata,
  MintSubdomainStatusCallback,
  MintSubdomainStep,
} from "../types";
import { Maybe } from "../utilities";

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
  statusCallback ? statusCallback(MintSubdomainStep.UploadingImage) : null;

  let imageUri: Maybe<string>;
  try {
    imageUri = await uploadMedia(params.image);
  } catch (e) {
    throw Error(`Failed to upload image: ${e}`);
  }

  let previewImageUri: Maybe<string>;
  try {
    if (params.previewImage) {
      previewImageUri = await uploadMedia(params.previewImage);
    }
  } catch (e) {
    throw Error(`Failed to upload preview image: ${e}`);
  }

  const metadata: DomainMetadata = {
    image: imageUri,
    previewImage: previewImageUri,
    description: params.description,
    title: params.title,
    ...params.additionalMetadata,
  };

  statusCallback ? statusCallback(MintSubdomainStep.UploadingMetadata) : null;

  let metadataUri: Maybe<string>;
  try {
    metadataUri = await uploadMetadata(metadata);
  } catch (e) {
    throw Error(`Failed to upload metadata: ${e}`);
  }

  statusCallback
    ? statusCallback(MintSubdomainStep.SubmittingTransaction)
    : null;

  let tx: Maybe<ethers.ContractTransaction>;
  try {
    tx = await registerSubdomain(
      params.parentId,
      params.label,
      owner,
      metadataUri,
      params.royaltyAmount,
      params.lockOnCreate
    );
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any).code === 4001) {
      throw Error(`User rejected transaction.`);
    }

    throw Error(`Failed to submit transaction: ${e}`);
  }

  statusCallback ? statusCallback(MintSubdomainStep.Completed) : null;

  return tx;
};
