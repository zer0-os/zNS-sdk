import { DomainMetadata } from "..";
import * as actions from "./actions";

export interface ApiClient {
  uploadMetadata: (metadata: DomainMetadata) => Promise<string>;
  uploadMedia: (media: Buffer) => Promise<string>;
}

export const createClient = (apiUri: string): ApiClient => {
  const apiClient: ApiClient = {
    uploadMetadata: (metadata: DomainMetadata) =>
      actions.uploadMetadata(apiUri, metadata),
    uploadMedia: (media: Buffer) => actions.uploadMedia(apiUri, media),
  };

  return apiClient;
};
