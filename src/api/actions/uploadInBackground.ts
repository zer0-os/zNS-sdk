import { checkBulkUploadJob } from ".";
import { UploadJobStatus, UrlToIPFS, UrlToJobId } from "../../types";
import { startBulkUpload } from "./startBulkUpload";
import * as fs from "fs";

const URLS_PER_CHUNK = 100;
const ERROR_FILEPATH = "error.json";
let errorJobs: {
  start: [{ url: string; error: unknown }];
  check: [{ url: string; jobId: string; error: unknown }];
};

let failedJobs: {
  start: [{ url: string; reason: string }];
  check: [{ url: string; jobId: string }];
};

let incompleteJobs: UrlToJobId = {};

export const uploadInBackground = async (
  apiUri: string,
  urls: string[],
  uploadedCallback?: (url: string, ipfsUrl: string) => void
): Promise<UrlToIPFS> => {
  let completedJobs: UrlToIPFS = {};
  const urlBatches: string[][] = chunkArray(urls, URLS_PER_CHUNK);
  const startBulkResponses: UrlToJobId = (
    await Promise.all(
      urlBatches.map(async (urls) => await tryStartBulkUpload(apiUri, urls))
    )
  ).reduce((accumulator, currentResponse) => {
    Object.entries(currentResponse).map(
      (urlToJobId) => (accumulator[urlToJobId[0]] = urlToJobId[1])
    );
    return accumulator;
  });
  incompleteJobs = startBulkResponses;

  let jobIdChunks: string[][] = chunkArray(
    Object.values(incompleteJobs),
    URLS_PER_CHUNK
  );
  while (Object.keys(incompleteJobs).length != 0)
    jobIdChunks
      .map((jobIds) => tryCheckBulkUploadJob(apiUri, jobIds))
      .map(async (promise) => {
        const uploadJobStatus: UploadJobStatus = await promise;
        Object.entries(uploadJobStatus).map((jobStatus) =>
          jobStatus[1].isCompleted
            ? () => {
                const jobId = jobStatus[0];
                const jobInfo = jobStatus[1];
                if (jobInfo.failed) {
                  failedJobs.check.push({ url: incompleteJobs[jobId], jobId });
                } else {
                  completedJobs[jobId] = jobInfo.result.hash;
                  uploadedCallback?.(jobId, jobInfo.result.hash);
                }
                delete incompleteJobs[jobId];
              }
            : () => {}
        );
      });

  fs.writeFileSync(ERROR_FILEPATH, JSON.stringify(errorJobs));

  return completedJobs;
};

const tryStartBulkUpload = async (
  apiUri: string,
  urls: string[]
): Promise<UrlToJobId> => {
  let uploadResponse: UrlToJobId = {};
  try {
    uploadResponse = await startBulkUpload(apiUri, urls);
  } catch (e) {
    urls.forEach((url) => errorJobs.start.push({ url: url, error: e }));
  }
  return uploadResponse;
};

const tryCheckBulkUploadJob = async (
  apiUri: string,
  jobIds: string[]
): Promise<UploadJobStatus> => {
  let checkResponse: UploadJobStatus = {};
  try {
    checkResponse = await checkBulkUploadJob(apiUri, jobIds);
  } catch (e) {
    jobIds.forEach((jobId) =>
      errorJobs.check.push({
        url: incompleteJobs[jobId] ?? "unknown",
        jobId,
        error: e,
      })
    );
  }

  return checkResponse;
};

const chunkArray = (array: any[], numChunks: number): any[][] => {
  let batches: any[][] = [];
  let numBatches: number = 0;
  let i: number = 0;
  while (i < array.length) {
    batches[numBatches] = array.slice(i, i + numChunks);
    i += URLS_PER_CHUNK;
    numBatches++;
  }

  return batches;
};
