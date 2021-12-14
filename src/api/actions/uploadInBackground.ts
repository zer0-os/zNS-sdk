import { checkBulkUploadJob } from "./checkBulkUploadJob";
import { startBulkUpload } from "./startBulkUpload";
import {
  JobIdToUrl,
  UploadJobStatus,
  UrlToIPFS,
  UrlToJobId,
} from "../../types";
import * as fs from "fs";

const URLS_PER_CHUNK_START = 100;
const URLS_PER_CHUNK_CHECK = 1000;
const ERROR_FILEPATH = "error.json";
const FAILURE_FILEPATH = "failed.json";

export interface StartErrorJob {
  url: string;
  error?: unknown;
}

export interface CheckErrorJob {
  url: string;
  jobId: string;
  error?: unknown;
}

let errorJobs: {
  start: StartErrorJob[];
  check: CheckErrorJob[];
} = {
  start: [],
  check: [],
};

let failedCheckJobs: UploadJobStatus;

let incompleteJobs: JobIdToUrl = {};

export const uploadInBackground = async (
  apiUri: string,
  urls: string[],
  uploadedCallback?: (url: string, ipfsUrl: string) => void
): Promise<UrlToIPFS> => {
  let completedJobs: UrlToIPFS = {};
  const urlBatches: string[][] = chunkArray(urls, URLS_PER_CHUNK_START);
  const startBulkResponses: UrlToJobId = (
    await Promise.all(
      // .map, .foreach cannot be async
      // to get around, you have to make it return a promise
      urlBatches.map(async (urls): Promise<UrlToJobId> => {
        return await tryStartBulkUpload(apiUri, urls);
      })
    )
  ).reduce((accumulator, currentResponse) => {
    Object.entries(currentResponse).forEach(
      ([key, value]) => (accumulator[key] = value)
    );
    return accumulator;
  });
  for (const key of Object.keys(startBulkResponses)) {
    incompleteJobs[startBulkResponses[key]] = key;
  }
  // same idea as above, map into promise and then await all promises
  while (Object.keys(incompleteJobs).length != 0) {
    let jobIdChunks: string[][] = chunkArray(
      Object.keys(incompleteJobs),
      URLS_PER_CHUNK_CHECK
    );

    for (const jobIds of jobIdChunks) {
      const statuses = await tryCheckBulkUploadJob(apiUri, jobIds);
      for (const jobId of jobIds) {
        const status = statuses[jobId];
        if (!status) continue;
        if (status?.isCompleted ?? false) {
          if (status.failed) {
            failedCheckJobs[jobId] = status;
          } else {
            completedJobs[jobId] = status.result.hash;
            uploadedCallback?.(jobId, status.result.hash);
          }
          delete incompleteJobs[jobId];
        }
      }
    }
    await delay(10);
  }

  fs.writeFileSync(ERROR_FILEPATH, JSON.stringify(errorJobs ?? ""));
  fs.writeFileSync(FAILURE_FILEPATH, JSON.stringify(failedCheckJobs ?? ""));

  return completedJobs;
};

const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const tryStartBulkUpload = async (
  apiUri: string,
  urls: string[]
): Promise<UrlToJobId> => {
  let uploadResponse: UrlToJobId = {};
  try {
    uploadResponse = await startBulkUpload(apiUri, urls);
  } catch (e) {
    urls.forEach((url) => {
      delete incompleteJobs[uploadResponse[url]];
      errorJobs.start.push({ url: url, error: e });
    });
  }
  return uploadResponse;
};

export const tryCheckBulkUploadJob = async (
  apiUri: string,
  jobIds: string[]
): Promise<UploadJobStatus> => {
  let checkResponse: UploadJobStatus = {};
  try {
    checkResponse = await checkBulkUploadJob(apiUri, jobIds);
  } catch (e) {
    jobIds.forEach((jobId) => {
      errorJobs.check.push({
        url: incompleteJobs[jobId] ?? "unknown",
        jobId,
        error: e,
      });
      delete incompleteJobs[jobId];
    });
  }

  return checkResponse;
};

const chunkArray = (array: any[], chunkSize: number): any[][] => {
  let batches: any[][] = [];
  let numBatches: number = 0;
  let i: number = 0;
  while (i < array.length) {
    batches[numBatches] = array.slice(i, i + chunkSize);
    i += chunkSize;
    numBatches++;
  }

  return batches;
};
