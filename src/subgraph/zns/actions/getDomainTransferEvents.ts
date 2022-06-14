import { ApolloClient } from "@apollo/client/core";
import { DomainEventType, DomainTransferEvent } from "../../../types";
import * as queries from "../queries";
import { AccountDto } from "../types";
import { performQuery } from "../../helpers";

interface DomainTransferDto {
  timestamp: string;
  from: AccountDto;
  to: AccountDto;
}

interface DomainTransfersDto {
  domainTransferreds: DomainTransferDto[];
}

export const getDomainTransferEvents = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string
): Promise<DomainTransferEvent[]> => {
  const queryResult = await performQuery<DomainTransfersDto>(
    apolloClient,
    queries.getDomainTransfers,
    { id: domainId }
  );

  const rawTransfers = queryResult.data.domainTransferreds;
  const transfers: DomainTransferEvent[] = rawTransfers.map((e) => {
    return {
      type: DomainEventType.transfer,
      timestamp: e.timestamp,
      from: e.from.id,
      to: e.to.id,
    } as DomainTransferEvent;
  });

  return transfers;
};
