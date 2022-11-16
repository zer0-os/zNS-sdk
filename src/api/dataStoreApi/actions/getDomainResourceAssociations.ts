import { Maybe } from "../../../types";
import { ResourceAssociation } from "../types";
import { makeApiCall } from "../../helpers";

export const getDomainResourceAssociations = async (
  apiUri: string,
  domainId: string
): Promise<ResourceAssociation[]> => {
  let response: Maybe<ResourceAssociation[]>;
  try {
    response = await makeApiCall<ResourceAssociation[]>(
      `${apiUri}v1/domains/resource/${domainId}`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get domain resource associations: ${domainId}`);
  }

  return response;
};
