export type DomainSortOptions = {
    created?: number;
    domainId?: number;
    isRoot?: number;
    children?: number;
    history?: number;
    label?: number;
    name?: number;
    parent?: number;
    labelHash?: number;
    minter?: number;
    owner?: number;
    metadataUri?: number;
    royaltyAmount?: number;
    registrar?: number;
    isValid?: number;
    buyNow?: number;
  };
  
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
    buyNow: undefined,
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
      if (value < 0 || value > 1) {
        throw new Error(
          `Error ${value} is not a valid sort direction, please specify either 0 (asc) or 1 (dsc)`
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
        sortOrderQueryString
    }

    return sortParameterStrings
  }  