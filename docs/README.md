# zNS-SDK

This documentation is intended to fulfill [developer user story #1](userStories/wilderWorldMvp1.md).

## Package

The SDK will be organized as a [npm package](https://docs.npmjs.com/packages-and-modules) under a [Zer0 organization](https://docs.npmjs.com/creating-an-organization), such as the following:
`
@zer0/zNS-sdk-js
`
As more functionality is added that broadens the scope of the SDK, it will eventually be broken out into multiple SDKs, such as:
`
@zer0/zNS-sdk-js
@zer0/zNS-sdk-react
@zer0/wilder-world/sdk-js
@zer0/...
`

## Instantiation

The root level context can be initialized explicitly in JavaScript: 
```
const zns = new ZnsSdk({
    subgraph: new SubgraphProvider({
      provider: "url to the hosted service"
      // in the future, this class can be upgraded to support queries on The Graph Network
    }),
    ethereum: new EthereumProvider({
      provider, // "rpc" | jsProvider /*window.ethereum*/
      signer?: // address | accIndex | Signer (priv key)
      // Reference: https://github.com/Web3-API/monorepo/blob/6a84f6875f7b6d9ca3e283b796f1c70f9eb6185b/packages/js/plugins/ethereum/src/index.ts#L20-L36
    })
  });
```

To make it easy for users of the SDK, default providers are constructed if no configuration or explicit initialization is done (fulfills [developer user story #2](userStories/wilderWorldMvp1.md)):
```
export const mainnetZnsSdk = (ethProvider: ExternalProvider) => new ZnsSdk({
    subgraph: new SubgraphProvider({
        provider: "url to the hosted service"
    }),
    ethereum: new EthereumProvider({
        provider: ethProvider
    })
})
```

For domains, as an example, the simplest initialization is done in the following manner: 
```
    import { Domain, mainnetZnsSdk } from "@zer0/zNS-sdk-js"
    const sdk = mainnetZnsSdk(window.ethereum); // Pass in Ethereum provider here
    let domain: Domain = new Domain(sdk, "0xID");   // Note: initializing domains does not query the subgraph
```

This is an example of the constructor being used for domains: 
```
    class Domain {
        //...
        constructor(sdk: ZnsSdk, id: string, parentId: string = constRootId/*, ...*/)) {
            this.sdk = sdk;
            this.id = id;
            this.parentId = parentId;
            //...
        }
        //...
    }
```

Wallet connection will be provided via a separate React SDK so as not to couple the JavaScript SDK to React libraries (fulfills [developer user story #3](userStories/wilderWorldMvp1.md)):
```
    import { connectZns } from "@zer0/zNS-sdk-react";
    import { mainnetZnsSdk } from "@zer0/zNS-sdk-js"
    
    const provider = await connectZns() // pop-up the React web3 connect modal w/ all the supported options (ledger, metamask, etc)
    const sdk = mainnetZnsSdk(window.ethereum);
```

## Reading
Domains can be consumed in the following manner: 
```
    import { Domain, mainnetZnsSdk } from "@zer0/zNS-sdk-js"
    const sdk = mainnetZnsSdk(window.ethereum);
    let initializedDomain: Domain = new Domain(sdk, "0xID");    // Note: initializing domains does not query the subgraph
    let queriedDomain = await domain.getDomain();               // Queried domains query the subgraph
    const subdomains: Domain[]  = domain.getSubdomains();
    
    for (const domain of subdomains) {
        // Do something with the array of subdomains
    }
```

```
    class Domain {
        //...        
        static getDomain() {
            return getDomain(this.sdk, this.id, this.mockData);
        }

        static getDomain(sdk: ZnsSdk, id: string, bool mockData = false) {
            // TODO:
            // - do a "where" query to the subgraph
            data = {
                domains(where: { id: $id }) {
                    id
                    }
                }
            // Maybe get all the neccesary fields here using a fragment
    
            return new Domain(zns, data.id);
        }

        static getSubDomains() {
            return getSubDomains(this.sdk, this.parentId, this.mockData);
        }

        static getSubdomains(sdk: ZnsSdk, parentId: string = constRootId, bool mockData = false) {
            if (!mockData) {
            // TODO:
            // - do a "where" query to the subgraph
            data = {
                domains(where: { parentId: $parentId }) {
                    id
                    }
                }
            // Maybe get all the neccesary fields here using a fragment
            }
    
            return new Domain(zns, data.id/*, ...*/);
        }
        //...        
    }
```


## Writing