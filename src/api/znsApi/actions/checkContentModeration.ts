import { ContentModeration } from "../types";
import { makeApiCall } from "../../helpers";
import { ContentModerationResponse, Maybe } from "../../../types";

const regex = /^[a-zA-Z0-9]+$/; //Matches whitespace and alphanumeric characters
const reasons = {
  specialCharacters: "Contains special characters.",
  explicitContent: "Contains explicit content.",
};
export const checkContentModeration = async (
  apiUri: string,
  text: string
): Promise<ContentModerationResponse> => {
  const response: ContentModerationResponse = {
    offendingTerms: [],
    flagged: false,
    reason: "",
  };
  try {
    if (!text.match(regex)) {
      response.flagged = true;
      response.reason = reasons.specialCharacters;
    } else {
      const moderation: Maybe<ContentModeration> =
        await makeApiCall<ContentModeration>(
          `${apiUri}/content/moderator`,
          "POST",
          text
        );
      if (moderation?.Classification?.ReviewRecommended ?? true) {
        response.flagged = true;
        response.reason = reasons.explicitContent;
        response.offendingTerms = moderation?.Terms?.map((x) => x?.Term) ?? [];
      }
    }
  } catch (e) {
    throw Error(`Unable to moderate content for term: ${text}, reason ${e}`);
  }

  return response;
};
