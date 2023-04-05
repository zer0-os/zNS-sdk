import { Maybe } from "../../../types";
import { ResourceRegistry } from "../types";
import { makeApiCall } from "../../helpers";

export const getResourceRegistry = async (
  apiUri: string,
  resourceType: string
): Promise<Maybe<ResourceRegistry>> => {
  let response: Maybe<ResourceRegistry>;
  try {
    response = await makeApiCall<ResourceRegistry>(
      `${apiUri}v1/resource-registry/get/${resourceType}`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get resource registry: ${resourceType}`);
  }

  return response;
};
