import * as subgraph from "../src/subgraph";
import * as zAuction from "@zero-tech/zauction-sdk";
import { getSubdomainTradingData } from "../src/actions";

const main = async () => {
  const domainId =
    "0x196c0a1e30004b9998c97b363e44f1f4e97497e59d52ad151208e9393d70bb3b";

  const znsRegistryAddress = "0xC613fCc3f81cC2888C5Cccc1620212420FFe4931";

  const znsSubgraphClient = subgraph.createClient(
    "https://api.thegraph.com/subgraphs/name/zer0-os/zns-kovan"
  );

  const zAuctionApi = "https://zauction-kovan-api.herokuapp.com/api";
  const zAuctionSubgraphUri =
    "https://api.thegraph.com/subgraphs/name/zer0-os/zauction-kovan";
  const zAuctionAddress = "0x18A804a028aAf1F30082E91d2947734961Dd7f89";
  const zAuctionInstance = zAuction.createInstance(
    zAuctionApi,
    zAuctionSubgraphUri,
    zAuctionAddress
  );

  try {
    const data = await getSubdomainTradingData(
      domainId,
      znsSubgraphClient.getSubdomainsById,
      (domainId: string) => zAuctionInstance.listSales(domainId)
    );

    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

main();
