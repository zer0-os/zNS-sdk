import { Bid, TokenBidCollection } from "@zero-tech/zauction-sdk";
import { BigNumber, ethers } from "ethers";
import { Domain, DomainTradingData } from "..";
import { Maybe } from "../utilities";

// Required information about domain sales
interface DomainSaleData {
  // Big Number
  saleAmount: string;
  timestamp: string;
}

type ListSubdomainsByIdFunction = (domainId: string) => Promise<Domain[]>;
type ListSalesByIdFunction = (domainId: string) => Promise<DomainSaleData[]>;
type ListBidsByIdFunction = (domainId: string) => Promise<Bid[]>;

interface TimeAmountPair {
  time: number;
  amount: string;
}

interface InternalDomainTradingData {
  lowestSalePrice: BigNumber;
  highestSalePrice: BigNumber;
  lastSale: TimeAmountPair;
  lastBid: TimeAmountPair;
}

const subdomainTradingData = async (
  domainId: string,
  listSubDomains: ListSubdomainsByIdFunction,
  listSales: ListSalesByIdFunction,
  listBids: ListBidsByIdFunction
): Promise<InternalDomainTradingData> => {
  // get all sub domains
  const subdomains: Domain[] = await listSubDomains(domainId);

  let lowestSalePrice: BigNumber = ethers.constants.MaxUint256;
  let highestSalePrice: BigNumber = BigNumber.from(0);
  let lastSale: TimeAmountPair = {
    time: 0,
    amount: "0",
  };
  let lastBid: TimeAmountPair = {
    time: 0,
    amount: "0",
  };

  for (const subdomain of subdomains) {
    const data = await domainTradingData(
      subdomain.id,
      listSubDomains,
      listSales,
      listBids
    );

    if (data.lowestSalePrice.lt(lowestSalePrice)) {
      lowestSalePrice = data.lowestSalePrice;
    }

    if (data.highestSalePrice.gt(highestSalePrice)) {
      highestSalePrice = data.highestSalePrice;
    }

    if (data.lastSale.time > lastSale.time) {
      lastSale = data.lastSale;
    }

    if (data.lastBid.time > lastBid.time) {
      lastBid = data.lastSale;
    }
  }

  const data: InternalDomainTradingData = {
    lowestSalePrice,
    highestSalePrice,
    lastSale,
    lastBid,
  };

  return data;
};

const domainTradingData = async (
  domainId: string,
  listSubDomains: ListSubdomainsByIdFunction,
  listSales: ListSalesByIdFunction,
  listBids: ListBidsByIdFunction
): Promise<InternalDomainTradingData> => {
  let lowestSalePrice: BigNumber = ethers.constants.MaxUint256;
  let highestSalePrice: BigNumber = BigNumber.from(0);
  let lastSale: TimeAmountPair = {
    time: 0,
    amount: "0",
  };
  let lastBid: TimeAmountPair = {
    time: 0,
    amount: "0",
  };

  const sales: DomainSaleData[] = await listSales(domainId);

  // Sort on time
  sales.sort((a, b) => {
    return Number(a.timestamp) - Number(b.timestamp);
  });

  for (const sale of sales) {
    // Search for new lowest/highest sale price
    const salePrice = BigNumber.from(sale.saleAmount);
    if (!lowestSalePrice || lowestSalePrice.gt(salePrice)) {
      lowestSalePrice = salePrice;
    }
    if (!highestSalePrice || highestSalePrice.lt(salePrice)) {
      highestSalePrice = salePrice;
    }
  }

  // Look to see if the most recent sale of this subdomain
  // is the most recent for all subdomains
  if (sales[0]) {
    const sale = sales[0];
    const saleTime = Number(sale.timestamp);
    if (lastSale.time < saleTime) {
      lastSale = {
        time: saleTime,
        amount: sale.saleAmount,
      };
    }
  }

  const bids = await listBids(domainId);
  if (bids[0]) {
    const bid = bids[0];
    const bidTime = Number(bid.timestamp);
    if (lastBid.time < bidTime) {
      lastBid = {
        time: bidTime,
        amount: bid.amount,
      };
    }
  }

  const subDomainData = await subdomainTradingData(
    domainId,
    listSubDomains,
    listSales,
    listBids
  );

  if (subDomainData.lowestSalePrice.lt(lowestSalePrice)) {
    lowestSalePrice = subDomainData.lowestSalePrice;
  }

  if (subDomainData.highestSalePrice.gt(highestSalePrice)) {
    highestSalePrice = subDomainData.highestSalePrice;
  }

  if (subDomainData.lastSale.time > lastSale.time) {
    lastSale = subDomainData.lastSale;
  }

  if (subDomainData.lastBid.time > lastBid.time) {
    lastBid = subDomainData.lastBid;
  }

  return {
    lowestSalePrice,
    highestSalePrice,
    lastSale,
    lastBid,
  };
};

export const getSubdomainTradingData = async (
  domainId: string,
  listSubDomains: ListSubdomainsByIdFunction,
  listSales: ListSalesByIdFunction,
  listBids: ListBidsByIdFunction
): Promise<DomainTradingData> => {
  const data = await domainTradingData(
    domainId,
    listSubDomains,
    listSales,
    listBids
  );

  // Format results and default where needed
  const tradingData: DomainTradingData = {
    lastSale: data.lastSale.amount ?? "0",
    lowestSale:
      (data.lowestSalePrice.eq(ethers.constants.MaxUint256)
        ? 0
        : data.lowestSalePrice
      ).toString() ?? "0",
    highestSale: data.highestSalePrice.toString() ?? "0",
    lastBid: data.lastBid.amount ?? "0",
  };

  return tradingData;
};
