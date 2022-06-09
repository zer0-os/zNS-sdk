import { assert } from "chai";
import { ImportMock } from "ts-mock-imports";
import { UploadJobStatus, UrlToJobId } from "../src/types";
import * as uploadInBackgroundFunctions from "../src/api/znsApi/actions/uploadInBackground";
import * as checkBulkUploadJob from "../src/api/znsApi/actions/checkBulkUploadJob";
import * as startBulkUpload from "../src/api/znsApi/actions/startBulkUpload";

describe("uploadInBackground", async () => {
  const fakeApiUri = "";
  const fakeUrl = "fakeJPEG.com";
  let fakeUrlList: string[] = [];
  let fakeStartJobResponse: UrlToJobId = {};
  let fakeCheckJobResponse: UploadJobStatus = {};

  beforeEach(() => {
    fakeUrlList = [];
    fakeStartJobResponse = {};
    fakeCheckJobResponse = {};
  });

  it("Calls startBulkUpload in batches", () => {
    for (let i = 0; i < 101; i++) {
      fakeUrlList[i] = fakeUrl + i;
      fakeStartJobResponse[fakeUrlList[i]] = i.toString();
    }
    const mockUpload = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryStartBulkUpload",
      fakeStartJobResponse
    ).resolves(fakeStartJobResponse);

    uploadInBackgroundFunctions.uploadInBackground(fakeApiUri, fakeUrlList);

    console.log(mockUpload.firstCall.args.length);
    assert(mockUpload.firstCall.args[1].length == 100);
    assert(mockUpload.secondCall.args[1].length == 1);

    mockUpload.restore();
  });

  it("Calls checkBulkUploadJob in batches", async () => {
    for (let i = 0; i < 1001; i++) {
      fakeUrlList[i] = fakeUrl + i;
      fakeStartJobResponse[fakeUrlList[i]] = i.toString();
      fakeCheckJobResponse[i] = {
        isCompleted: true,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      };
    }
    const mockUpload = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryStartBulkUpload",
      fakeStartJobResponse
    ).resolves(fakeStartJobResponse);

    const mockCheckJob = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryCheckBulkUploadJob",
      fakeCheckJobResponse
    ).resolves(fakeCheckJobResponse);

    await uploadInBackgroundFunctions.uploadInBackground(
      fakeApiUri,
      fakeUrlList
    );

    assert(mockCheckJob.firstCall.args[1].length == 1000);
    assert(mockCheckJob.secondCall.args[1].length == 1);

    mockUpload.restore();
    mockCheckJob.restore();
  });

  it("Rechecks jobs that are not complete", async () => {
    const incompleteResponse: UploadJobStatus = {};
    for (let i = 0; i < 1000; i++) {
      fakeUrlList[i] = fakeUrl + i;
      fakeStartJobResponse[fakeUrlList[i]] = i.toString();
      incompleteResponse[i] = {
        isCompleted: false,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      };
      fakeCheckJobResponse[i] = {
        isCompleted: true,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      };
    }
    const mockUpload = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryStartBulkUpload",
      fakeStartJobResponse
    ).resolves(fakeStartJobResponse);

    const mockCheckJob = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryCheckBulkUploadJob",
      fakeCheckJobResponse
    )
      .onCall(0)
      .resolves(incompleteResponse)
      .onCall(1)
      .resolves(incompleteResponse)
      .onCall(2)
      .resolves(fakeCheckJobResponse);

    await uploadInBackgroundFunctions.uploadInBackground(
      fakeApiUri,
      fakeUrlList
    );

    assert(mockCheckJob.firstCall.args[1].length == 1000);
    assert(mockCheckJob.secondCall.args[1].length == 1000);
    assert(mockCheckJob.thirdCall.args[1].length == 1000);
    assert(mockCheckJob.callCount == 3);

    mockUpload.restore();
    mockCheckJob.restore();
  });

  it("Does not restart errored jobs", async () => {
    for (let i = 0; i < 100; i++) {
      fakeUrlList[i] = fakeUrl + i;
      fakeStartJobResponse[fakeUrlList[i]] = i.toString();
      fakeCheckJobResponse[i] = {
        isCompleted: true,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      };
    }
    const mockUpload = ImportMock.mockFunction(
      startBulkUpload,
      "startBulkUpload",
      fakeStartJobResponse
    ).throws("fakeError");

    try {
      await uploadInBackgroundFunctions.uploadInBackground(
        fakeApiUri,
        fakeUrlList
      );
    } catch {
      assert.fail();
    }

    assert(mockUpload.called);

    assert(mockUpload.firstCall.args[1].length == 100);
    assert(mockUpload.callCount == 1);

    mockUpload.restore();
  });

  it("Does not recheck errored jobs", async () => {
    for (let i = 0; i < 100; i++) {
      fakeUrlList[i] = fakeUrl + i;
      fakeStartJobResponse[fakeUrlList[i]] = i.toString();
      fakeCheckJobResponse[i] = {
        isCompleted: true,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      };
    }

    const mockUpload = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryStartBulkUpload",
      fakeStartJobResponse
    ).resolves(fakeStartJobResponse);

    const mockCheckJob = ImportMock.mockFunction(
      checkBulkUploadJob,
      "checkBulkUploadJob"
    ).throws("fakeError");

    try {
      await uploadInBackgroundFunctions.uploadInBackground(
        fakeApiUri,
        fakeUrlList
      );
    } catch (e) {
      console.log(e);
      assert.fail();
    }

    assert(mockCheckJob.called);

    assert(mockCheckJob.firstCall.args[1].length == 100);
    assert(mockCheckJob.callCount == 1);

    mockCheckJob.restore();
    mockUpload.restore();
  });

  it("Calls a callback function when a job is uploaded", async () => {
    let calledCallback = false;
    let i = 0;
    fakeUrlList[i] = fakeUrl + i;
    fakeStartJobResponse[fakeUrlList[i]] = i.toString();
    fakeCheckJobResponse = {
      [i]: {
        isCompleted: true,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      },
    };
    const mockUpload = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryStartBulkUpload",
      fakeStartJobResponse
    ).resolves(fakeStartJobResponse);

    const mockCheckJob = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryCheckBulkUploadJob",
      fakeCheckJobResponse
    ).resolves(fakeCheckJobResponse);

    await uploadInBackgroundFunctions.uploadInBackground(
      fakeApiUri,
      fakeUrlList,
      (_, __) => {
        calledCallback = true;
      }
    );

    assert(calledCallback);

    mockUpload.restore();
    mockCheckJob.restore();
  });

  it("Calls a callback function for erroredJobs", async () => {
    let calledCallback = false;
    for (let i = 0; i < 100; i++) {
      fakeUrlList[i] = fakeUrl + i;
      fakeStartJobResponse[fakeUrlList[i]] = i.toString();
      fakeCheckJobResponse[i] = {
        isCompleted: true,
        result: { url: fakeUrl + i, hash: "test" },
        failed: false,
      };
    }
    const mockUpload = ImportMock.mockFunction(
      uploadInBackgroundFunctions,
      "tryStartBulkUpload",
      fakeStartJobResponse
    ).resolves(fakeStartJobResponse);

    const mockCheckJob = ImportMock.mockFunction(
      checkBulkUploadJob,
      "checkBulkUploadJob"
    ).throws("fakeError");

    await uploadInBackgroundFunctions.uploadInBackground(
      fakeApiUri,
      fakeUrlList,
      (_, __) => {},
      (_) => (calledCallback = true)
    );

    assert(calledCallback);

    mockUpload.restore();
    mockCheckJob.restore();
  });
});
