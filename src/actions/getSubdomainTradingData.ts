import { Bid } from "@zero-tech/zauction-sdk";
import { BigNumber, ethers } from "ethers";
import { Domain, DomainTradingData } from "..";

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
  highestBid: BigNumber;
  volume: BigNumber;
  items: number;
  holders: string[];
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
  let highestBid: BigNumber = BigNumber.from(0);
  let volume: BigNumber = BigNumber.from(0);
  let items = subdomains.length;
  let holders: string[] = [];

  for (const subdomain of subdomains) {
    holders.push(subdomain.owner);

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
      lastBid = data.lastBid;
    }

    if (data.highestBid.gt(highestBid)) {
      highestBid = data.highestBid;
    }

    volume = volume.add(data.volume);

    items += data.items;
    holders = holders.concat(holders, data.holders);
  }

  const data: InternalDomainTradingData = {
    lowestSalePrice,
    highestSalePrice,
    lastSale,
    lastBid,
    highestBid,
    volume,
    items,
    holders,
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
  let highestBid: BigNumber = BigNumber.from(0);
  let volume: BigNumber = BigNumber.from(0);
  let items = 0;
  let holders: string[] = [];

  const sales: DomainSaleData[] = await listSales(domainId);

  // Sort on time
  sales.sort((a, b) => {
    return Number(a.timestamp) - Number(b.timestamp);
  });

  for (const sale of sales) {
    // Search for new lowest/highest sale price
    const salePrice = BigNumber.from(sale.saleAmount);
    if (lowestSalePrice.gt(salePrice)) {
      lowestSalePrice = salePrice;
    }
    if (highestSalePrice.lt(salePrice)) {
      highestSalePrice = salePrice;
    }

    volume = volume.add(salePrice);

    // get the most recent sale
    const saleTime = Number(sale.timestamp);
    if (lastSale.time < saleTime) {
      lastSale = {
        time: saleTime,
        amount: sale.saleAmount,
      };
    }
  }

  const bids = await listBids(domainId);

  for (const bid of bids) {
    const bidAmount = BigNumber.from(bid.amount);

    // Calculate the highest bid
    if (bidAmount.gt(highestBid)) {
      highestBid = bidAmount;
    }

    // calculate the last bid
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

  if (subDomainData.highestBid.gt(highestBid)) {
    highestBid = subDomainData.highestBid;
  }

  volume = volume.add(subDomainData.volume);
  items = subDomainData.items;

  holders = subDomainData.holders;

  return {
    lowestSalePrice,
    highestSalePrice,
    lastSale,
    lastBid,
    highestBid,
    volume,
    items,
    holders,
  };
};

export const getSubdomainTradingData = async (
  domainId: string,
  listSubDomains: ListSubdomainsByIdFunction,
  listSales: ListSalesByIdFunction,
  listBids: ListBidsByIdFunction
): Promise<DomainTradingData> => {
  const data = await subdomainTradingData(
    domainId,
    listSubDomains,
    listSales,
    listBids
  );

  const uniqueHolders = data.holders.filter(
    (value, index) => data.holders.indexOf(value) === index
  );

  // Format results and default where needed
  const tradingData: DomainTradingData = {
    lastSale: data.lastSale.amount,
    lowestSale: (data.lowestSalePrice.eq(ethers.constants.MaxUint256)
      ? 0
      : data.lowestSalePrice
    ).toString(),
    highestSale: data.highestSalePrice.toString(),
    lastBid: data.lastBid.amount,
    highestBid: data.highestBid.toString(),
    volume: data.volume.toString(),
    items: data.items,
    holders: uniqueHolders.length,
  };

  return tradingData;
};
