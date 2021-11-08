import { DomainMetadata } from "../types";
import * as actions from "./actions";

export interface ApiClient {
  uploadMetadata: (metadata: DomainMetadata) => Promise<string>;
  uploadMedia: (media: Buffer) => Promise<string>;
  uploadObject: (object: Record<string, unknown>) => Promise<string>;
}

export const createClient = (apiUri: string): ApiClient => {
  const apiClient: ApiClient = {
    uploadMetadata: (metadata: DomainMetadata) =>
      actions.uploadMetadata(apiUri, metadata),
    uploadMedia: (media: Buffer) => actions.uploadMedia(apiUri, media),
    uploadObject: (object: Record<string, unknown>) =>
      actions.uploadObject(apiUri, object),
  };

  return apiClient;
};
