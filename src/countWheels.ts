import * as subgraph from "./subgraph";
import { Config, zAuctionRoute } from "./types";
import { ethers } from "ethers";
import fs from "fs";

const registrarAddress = "0xa4F6C921f914ff7972D7C55c15f015419326e0Ca";
const basicControllerAddress = "0x1188dD1a0F42BA4a117EF1c09D884f5183D40B28";

interface NameToId {
  id: string;
  name: string;
}

const config: Config = {
  subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zns",
  metricsUri: "https://zns-metrics-kovan.herokuapp.com", // todo metrics on rinkeby
  apiUri: "https://zns.api.zero.tech/api",
  zAuctionRoutes: [{} as zAuctionRoute],
  basicController: basicControllerAddress,
  registrar: registrarAddress,
};

const subgraphClient = subgraph.createClient(config.subgraphUri);

const ids: string[] = [];

const main = async () => {
  const domains: NameToId[] = [];
  const domainData = await subgraphClient.getSubdomainsById(
    "0x1badd5424f77b34024ce6ca99fa03c10e5e1f46298f841de30d6fcecb6b846ad"
  );
  let burned = 0;
  for (let i = 0; i < domainData.length; i++) {
    const domain = domainData[i];
    const result: NameToId = { id: domain.id, name: domain.name };
    domains.push(result);
    if (domain.owner === ethers.constants.AddressZero) {
      console.log(domain.id);
      burned++;
    }
  }

  domains.sort((a, b) => a.name.localeCompare(b.name));

  domains.forEach((domain) => {
    ids.push(domain.id);
  });

  console.log(
    `Total Count: ${domainData.length} - Burned: ${burned} - Total existing: ${
      domainData.length - burned
    }`
  );

  fs.writeFileSync(`s0IDs.json`, JSON.stringify(ids));
};

main();
