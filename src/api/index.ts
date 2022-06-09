export { createZnsApiClient, znsApiClient } from "./znsApi/client";
export { createDataStoreApiClient, DataStoreApiClient as DataStoreApiClient } from "./dataStoreApi/client";
// import { znsApiClient } from "./znsApi/client";


// export interface ApiClient {
//   apiClient: znsApiClient | DataStoreApiClient
// }

// export enum ClientType {
//   zNS,
//   DataStore
// }

// export const createClient = (apiClient: ClientType, apiUri: string) => {
//   let client: ApiClient;
//   if(apiClient === ClientType.zNS) {
//     // client = 
//     // could this create a bug where wrong apiuri to wrong client?
//   }
// }