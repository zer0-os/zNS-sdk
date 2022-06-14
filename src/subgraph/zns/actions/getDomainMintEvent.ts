import { ApolloClient } from "@apollo/client/core";
import { DomainEventType, DomainMintEvent } from "../../../types";
import * as queries from "../queries";
import { AccountDto } from "../types";
import { performQuery } from "../../helpers";

interface DomainMintedDto {
  timestamp: string;
  minter: AccountDto;
}

interface DomainMintedDto {
  domainMinted: DomainMintedDto;
}

export const getDomainMintEvent = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string
): Promise<DomainMintEvent> => {
  const queryResult = await performQuery<DomainMintedDto>(
    apolloClient,
    queries.getDomainMintEvent,
    { id: domainId }
  );

  const rawMintEvent = queryResult.data.domainMinted;
  const mintEvent: DomainMintEvent = {
    type: DomainEventType.mint,
    timestamp: rawMintEvent.timestamp,
    minter: rawMintEvent.minter.id,
  };

  return mintEvent;
};
