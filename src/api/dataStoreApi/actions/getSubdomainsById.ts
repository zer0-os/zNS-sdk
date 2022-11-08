import { Domain, Maybe } from "../../../types";
import { DomainCollection, DomainSortOptions } from "../types";
import { makeApiCall } from "../../helpers";
import { datastoreDomainToDomain } from "../helpers/datastoreDomainToDomain";
import { desiredSortToQueryParams } from "../helpers/desiredSortToQueryParams";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string,
  limit = 100,
  skip = 0,
  sort?: DomainSortOptions
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  let sortBy = ""
  let sortDirections = ""

  if (sort) {
    const sortQueryParameterStrings = desiredSortToQueryParams(sort);
    sortBy = sortQueryParameterStrings.sortQueryString,
    sortDirections = sortQueryParameterStrings.sortOrderQueryString
  }

  try {
    let requestUri = `${apiUri}v1/domains/subdomains/${tokenId}?skip=${skip}&limit=${limit}`;
    if (sortBy && sortDirections) {
      requestUri += `&${sortBy}&${sortDirections}`;
    }

    response = await makeApiCall<DomainCollection>(
      requestUri,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get subdomains for ${tokenId}: ${e}`);
  }

 // Map from DataStoreDomain -> Domain for downstream consistency
 const domains: Domain[] = response.results.map((d) => {
  return datastoreDomainToDomain(d);
});

  return domains;
};
