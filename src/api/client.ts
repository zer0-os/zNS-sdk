import { DomainMetadata, UploadJobStatus, UrlToJobId } from "../types";
import * as actions from "./actions";

export interface ApiClient {
  uploadMetadata: (metadata: DomainMetadata) => Promise<string>;
  uploadMedia: (media: Buffer) => Promise<string>;
  uploadObject: (object: Record<string, unknown>) => Promise<string>;
  startBulkUpload: (urls: string[]) => Promise<UrlToJobId[]>;
  checkBulkUploadJob: (urls: string[]) => Promise<UploadJobStatus[]>;
}

export const createClient = (apiUri: string): ApiClient => {
  const apiClient: ApiClient = {
    uploadMetadata: (metadata: DomainMetadata) =>
      actions.uploadMetadata(apiUri, metadata),
    uploadMedia: (media: Buffer) => actions.uploadMedia(apiUri, media),
    uploadObject: (object: Record<string, unknown>) =>
      actions.uploadObject(apiUri, object),
    startBulkUpload: (urls: string[]) => actions.startBulkUpload(apiUri, urls),
    checkBulkUploadJob: (urls: string[]) =>
      actions.checkBulkUploadJob(apiUri, urls),
  };

  return apiClient;
};
