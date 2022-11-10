import { DomainSortOptions } from "../types";

export const domainSortingOptionsReflection = {
  domainId: "",
  name: undefined,
  parent: undefined,
  labelHash: undefined,
  minter: undefined,
  owner: undefined,
  metadataUri: undefined,
  royaltyAmount: undefined,
  created: undefined,
  registrar: undefined,
  isValid: false,
  "buyNow.price": undefined,
  "buyNow.time": undefined,
};

export function desiredSortToQueryParams(sort: DomainSortOptions) {
  const possibleSortParams = Object.keys(domainSortingOptionsReflection);
  const sortKeyValues = Object.entries(sort);

  let sortQueryString = "";
  let sortOrderQueryString = "";

  sortKeyValues.forEach((entry) => {
    const key = entry[0];
    const value = entry[1];
    if (!possibleSortParams.find((validParam) => validParam === key)) {
      throw new Error(`Error: ${key} is not a valid sorting parameter.`);
    }
    if (value !== "asc" && value !== "desc") {
      throw new Error(
        `Error ${value} is not a valid sort direction, please specify either asc (ascending) or desc (descending)`
      );
    }

    if (sortQueryString.length === 0) {
      sortQueryString = "sort=";
    }
    if (sortOrderQueryString.length === 0) {
      sortOrderQueryString = "sortDirection=";
    }

    sortQueryString += key;
    sortOrderQueryString += value;
  });

  const sortParameterStrings = {
    sortQueryString,
    sortOrderQueryString,
  };

  return sortParameterStrings;
}
