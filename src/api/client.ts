import {
  ContentModerationResponse,
  DomainMetadata,
  UploadJobStatus,
  UrlToJobId,
} from "../types";
import * as actions from "./actions";

import { getLogger } from "../utilities";

const logger = getLogger("api:client");

export interface ApiClient {
  uploadMetadata: (metadata: DomainMetadata) => Promise<string>;
  uploadMedia: (media: Buffer) => Promise<string>;
  uploadObject: (object: Record<string, unknown>) => Promise<string>;
  startBulkUpload: (urls: string[]) => Promise<UrlToJobId>;
  checkBulkUploadJob: (urls: string[]) => Promise<UploadJobStatus>;
  checkContentModeration: (text: string) => Promise<ContentModerationResponse>;
}

export const createClient = (apiUri: string, utilityUri: string): ApiClient => {
  const apiClient: ApiClient = {
    uploadMetadata: (metadata: DomainMetadata) => {
      logger.debug(`Upload domain metadata for ${metadata.name}`);
      const metadataUri = actions.uploadMetadata(apiUri, metadata);
      return metadataUri;
    },
    uploadMedia: (media: Buffer) => {
      logger.debug(`Upload media for domain`);
      const mediaUri = actions.uploadMedia(apiUri, media);
      return mediaUri;
    },
    uploadObject: (object: Record<string, unknown>) => {
      logger.debug(`Upload object for domain`);
      const record = actions.uploadObject(apiUri, object);
      return record;
    },
    startBulkUpload: (urls: string[]) => {
      logger.debug(`Start bulk upload for ${urls.length} URLs`);
      const urlToJobIdMapping = actions.startBulkUpload(apiUri, urls);
      return urlToJobIdMapping;
    },
    checkBulkUploadJob: (jobIds: string[]) => {
      logger.debug(`Check bulk upload status for ${jobIds.length} jobs`);
      const status = actions.checkBulkUploadJob(apiUri, jobIds);
      return status;
    },
    checkContentModeration: (text: string) => {
      logger.debug(`Checking content moderation for: ${text}`);
      const contentModeration = actions.checkContentModeration(
        utilityUri,
        text
      );
      return contentModeration;
    },
  };

  return apiClient;
};
