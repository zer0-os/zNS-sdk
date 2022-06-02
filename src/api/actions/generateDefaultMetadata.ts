import { DomainMetadata } from "../../types";
import { Maybe } from "../../utilities";
import * as actions from "../actions";

export const generateDefaultMetadata = async (
  apiUri: string,
  name: string
): Promise<string> => {
  let response: Maybe<string>;
  try {
    const domainMetaData: DomainMetadata = {
      name: `0://${name}`,
      description: `0://${name} - A Zero Name Service (zNS) Root Domain on the Ethereum Blockchain`,
      image: "ipfs://QmXni8ehkAiwpgBLRsdKTfEZKvRcZgNJF2vVws3QoRLS6Q",
    }
    response = await actions.uploadMetadata(apiUri, domainMetaData);
  } catch (e) {
    throw Error(`Failed to generate default metadata for: ${e}`);
  }

  return response;
};
