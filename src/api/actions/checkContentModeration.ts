import { Maybe } from "../../utilities";
import { ContentModeration, ContentModerationResponse } from "../../types";
import { makeApiCall } from "./helpers";

const regex = /[^\w\s]/; //Matches whitespace and alphanumeric characters
const reasons = {
  specialCharacters: "Contains special characters.",
  explicitContent: "Contains explicit content."
}
export const checkContentModeration = async (
  apiUri: string,
  text: string
): Promise<ContentModerationResponse> => {
  let moderation: Maybe<ContentModeration>;
  let response: ContentModerationResponse = {
    offendingTerms: [],
    flagged: false,
    reason: ""
  }
  try {
    if (text.match(regex))
    {
      response.flagged = true;
      response.reason = reasons.specialCharacters;
    } else {
      moderation = await makeApiCall<ContentModeration>(
        `${apiUri}/content/moderator`,
        "POST",
        text
      );
      if (moderation?.Classification?.ReviewRecommended ?? true)
      {
        response.flagged = true;
        response.reason = reasons.explicitContent;
        response.offendingTerms = moderation?.Terms?.map( x => x?.Term) ?? [];
      }
    }
  } catch (e) {
    throw Error(`Unable to moderate content for term: ${text}, reason ${e}`);
  }

  return response;
};
