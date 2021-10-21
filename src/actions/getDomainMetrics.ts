import { makeApiCall } from "../api/actions/helpers";
import { DomainMetricsCollection } from "../types";

export const getDomainMetrics = async (
  metricsApiUri: string,
  domainIds: string[]
): Promise<DomainMetricsCollection> => {
  const response = await makeApiCall<DomainMetricsCollection>(
    `${metricsApiUri}/api/metrics`,
    "POST",
    {
      tokenIds: domainIds,
    }
  );

  return response;
};
