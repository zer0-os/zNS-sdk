import { checkBulkUploadJob } from ".";
import { UploadJobStatus, UrlToIPFS, UrlToJobId } from "../../types";
import { startBulkUpload } from "./startBulkUpload";

const URLS_PER_CHUNK = 100;

export const uploadInBackground = async (
  apiUri: string,
  urls: string[],
  uploadedCallback?: (url: string, ipfsUrl: string) => void
): Promise<UrlToIPFS> => {
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

  let incompleteJobs: UrlToJobId = startBulkResponses;
  let completedJobs: UrlToIPFS = {};

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
                completedJobs[jobId] = jobInfo.result.hash;
                uploadedCallback?.(jobId, jobInfo.result.hash);
                delete incompleteJobs[jobId];
              }
            : () => {}
        );
      });

  return completedJobs;
};

const tryStartBulkUpload = async (
  apiUri: string,
  urls: string[]
): Promise<UrlToJobId> => {
  let uploadResponse: UrlToJobId;
  try {
    uploadResponse = await startBulkUpload(apiUri, urls);
  } catch (e) {
    throw Error(`Bulk upload failed: ${e}`);
  }
  return uploadResponse;
};

const tryCheckBulkUploadJob = async (
  apiUri: string,
  jobIds: string[]
): Promise<UploadJobStatus> => {
  let checkResponse: UploadJobStatus;
  try {
    checkResponse = await checkBulkUploadJob(apiUri, jobIds);
  } catch (e) {
    throw Error(`Check upload status failed: ${e}`);
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
