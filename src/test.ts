import * as subgraph from "../src/subgraph";
import { Config, zAuctionRoute } from "../src/types";
import * as fs from "fs";

const registrarAddress = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca";
const basicControllerAddress = "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28";

const config: Config = {
  subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns",
  metricsUri: "https://zns-metrics-kovan.herokuapp.com", // todo metrics on rinkeby
  apiUri: "https://zns.api.zero.tech/api",
  zAuctionRoutes: [{} as zAuctionRoute],
  basicController: basicControllerAddress,
  registrar: registrarAddress,
};

const subgraphClient = subgraph.createClient(config.subgraphUri);

const main = async () => {
  const ids: string[] = [];
  const domainData = await subgraphClient.getSubdomainsById(
    "0x99f58bd76da4ca166dac9a7adbae7a8d10656a28a38d8fe029e103b881831e66"
  );
  //domainData.forEach((domain) => {
  for (let i = 0; i < domainData.length; i++) {
    const domain = domainData[i];
    const ipfsHash = domain.metadataUri.substring(7);
    const id = domain.id;
    const domainName = await subgraphClient.getDomainById(id);
    if (parseInt(domainName.name.split(".")[4]) <= 197) {
      console.log(`${ipfsHash} - ${i} - ${domainName.name}`);
      ids.push(id);
    }
  }

  fs.writeFileSync("nonburnedS1.json", JSON.stringify({ ids }));
};

main();
