import { makeApiCall } from "../api/actions/helpers";
import { DomainMetricsCollection } from "../types";
import { getLogger } from "../utilities";

const logger = getLogger("actions:getDomainMetrics");

export const getDomainMetrics = async (
  metricsApiUri: string,
  domainIds: string[]
): Promise<DomainMetricsCollection> => {
  logger.trace(`Get domain metrics for ${domainIds.length} domains`);
  const response = await makeApiCall<DomainMetricsCollection>(
    `${metricsApiUri}/api/metrics`,
    "POST",
    {
      tokenIds: domainIds,
    }
  );

  return response;
};
