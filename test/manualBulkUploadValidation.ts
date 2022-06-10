import { ethers } from "ethers";
import { createInstance } from "../src";
import { configuration } from "../src";
import { Web3Provider } from "@ethersproject/providers";
import { Config, UploadJobStatus, UrlToJobId } from "../src/types";

const main = async () => {
  let sdkConfig: Config = configuration.mainnetConfiguration(
    ethers.providers.getDefaultProvider(
      ethers.providers.getNetwork("mainnet"),
      {
        etherscan: process.env.ETHERSCAN_API_TOKEN,
      }
    ) as Web3Provider
  );

  sdkConfig.znsUri = "https://zns-backend-dev.herokuapp.com/api";

  const instance = createInstance(sdkConfig);

  const urlToUpload =
    "https://www.gannett-cdn.com/presto/2021/07/01/NLSL/66dca959-6a69-42ad-a43b-32e5c5f952e5-frogging.jpg";

  const upload: UrlToJobId = await instance.utility.startUrlUploadJob([
    urlToUpload, //29401
  ]);
  console.log(urlToUpload);
  console.log(upload[urlToUpload]);

  const jobStatus: UploadJobStatus = await instance.utility.checkBulkUploadJob([
    upload[urlToUpload],
  ]);

  console.log(jobStatus);
};

main();
