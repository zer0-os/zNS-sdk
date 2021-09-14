import { BigNumber } from "ethers";
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

export const getSubdomainTradingData = async (
  domainId: string,
  listSubDomains: ListSubdomainsByIdFunction,
  listSales: ListSalesByIdFunction
): Promise<DomainTradingData> => {
  // get all sub domains
  const subdomains: Domain[] = await listSubDomains(domainId);

  let lowestSalePrice: Maybe<BigNumber>;
  let highestSalePrice: Maybe<BigNumber>;

  interface LastSale {
    time: number;
    amount: string;
  }
  let lastSale: Maybe<LastSale>;

  for (const subdomain of subdomains) {
    const sales: DomainSaleData[] = await listSales(subdomain.id);

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
      if (!lastSale || lastSale.time < saleTime) {
        lastSale = {
          time: saleTime,
          amount: sale.saleAmount,
        };
      }
    }
  }

  // Format results and default where needed
  const tradingData: DomainTradingData = {
    lastSale: lastSale?.amount ?? "0",
    lowestSale: lowestSalePrice?.toString() ?? "0",
    highestSale: highestSalePrice?.toString() ?? "0",
  };

  return tradingData;
};
