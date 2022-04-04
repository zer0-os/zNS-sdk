import { ethers } from "ethers";
import * as sdk from "../src";

const provider = ethers.getDefaultProvider();
const instance = sdk.createInstance(
  sdk.configuration.mainnetConfiguration(provider)
);

const main = async () => {
  const domains = await instance.getSubdomainsById(
    sdk.domains.domainNameToId("wilder.wheels.genesis")
  );

  console.log(
    domains.filter((e) => e.owner === ethers.constants.AddressZero).length
  );
  console.log(domains.length);
};

main().catch(console.error);
