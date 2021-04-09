// SDK Use Cases
// 1. Instantiation [x]
// 2. Reading (subgraph [of your choosing])
// 3. Writing (ethereum [of your chosen provider])


// 1. Instantiation
// Root level context
const zns = new ZNS({
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
  
  const domain = new Domain(zns, "0xID");
  const namedDomain = Domain.fromName(zns, "User Friendly Name");
  
  
  class Domain {
    static fromName(zns: ZNS, name: string): Domain {
      // TODO:
      // - do a "where" query to the subgraph
      /*
        data = {
          domains(where: { name: $name }) {
            id
          }
        }
        maybe get all the fields here using the fragment (discussed below)
  
        return new Domain(zns, data.id)
  
        TODO: error handling if the name isn't set (should never happen [but might in weird cases...])
      */
    }
  }
  
  const subdomains = domain.subdomains();
  
  for (const domain of subdomains) {
  
  }
  
  // To make it easy for users of the ZNS SDK, you can construct default providers:
  export const mainnetZns = (ethProvider: ExternalProvider) => new ZNS({
    subgraph: new SubgraphProvider({
      provider: "url to the hosted service"
    }),
    ethereum: new EthereumProvider({
      provider: ethProvider
    })
  })
  
  import { mainnetZns } from "@zns/sdk-js";
  
  const zns = mainnetZns(window.ethereum)
  
  import { connectZns } from "@zns/sdk-react";
  
  const zns = await connectZns() // pop-up the React web3 connect modal w/ all the supported options (ledger, metamask, etc)
  
  // 2. Reading?
  // GraphQL Schema -> TypeScript Interfaces (automatic) (talk to Nestor for his guidance here)
  import { codegen } from "@graphql-codegen/core";
  import * as typescriptPlugin from "@graphql-codegen/typescript";
  import { parse, print } from "graphql";
  
  const config = {
    filename: "./path/to/types.ts",
    schema: parse(print(gqlSchema)),
    plugins: [
      {
        typescript: {},
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
    },
  };
  
  await codegen(config as any);
  
  // Example output:
  
  /*
  type Domain @entity {
    id: ID!
    name: String
    labelHash: String
    ...
  }
  */
  
  // turns into...
  
  /*
  export interface IDomainData {
    id: Scalars['ID'];
    name: Scalars['String'];
    labelHash: Scalars['String'];
    ...
  };
  
  class Domain {
    public get data(): Promise<IDomainData> {
      // fetch the data from the subgraph and return it here
    }
  }
  
  await domain.data
  
  // 1. Caching?
  // 2. Updates?
  // 3. Over Fetching (get partial data?)
  
  // 1. Solve this by using ApolloClient which automatically handles caching for you!
  
  NOTE:
  in order ot have Apollo cache your data to minimize
  refetching, the ID must be used in the query
  
  NOTE:
  if you'd like custom caching that works across refreshing, talk to Nestor (there are solutions)
  
  // 2. Update can automatically propagate through using rxjs subscriptions
  
  In the example above instead of return Promise<IDomainData> you would return
  Subscription<IDomainData>
  
  You would want to support both interfaces, so maybe you do...
  fetchData: Promise<IData> // 1 time fetch, no auto updates
  subData: Subscription<IData> // open subscription that auto updates
  
  // this is rxjs syntax so DYOR
  domain.subData().pipe((data) => {
    setComponentState(data) // triggers a rerender
  })
  
  subData is actually sending a `subscription` query to the subgraph,
  which opens a websocket that will feed new data into your app as it's
  modified in the subgraph.
  
  
  // 3 probably not worth diving into right now, but there are techniques
  // where you can pass a "filter" object into the fetch / sub functions
  // that will only return to you the data you need.
  // - talk w/ Nestor as I think they did this in the dgov SDK
  
  type IDomainDataFilter = Partial<IDomainData>;
  */
  
  /*
  when you're actually writing these subgraph queries, we don't want
  to manually type out each property that we're fetching, since this
  can change when the schema changes.
  
  So this means that we can use GraphQL Fragments that get auto-generated
  from the GraphQL schema just like we did for the TypeScript interfaces.
  
  This allows us to do something simple like this:
  
  import { DomainFragment } from "./auto-gened-types.ts";
  
  subgraph.query(gql`
    domain {
      ...DomainFragment
    }
    ${DomainFragment}
  `)
  
  NOTE: in the fragment, leave out all array propertyes (ex: subdomains, etc).
  We do this because they can be large and query response size is limited.
  
  Instead, expose them through public getters (that return rxjs subscriptions) like so:
  domain.subdomains().pipe((subdomains) => {
    setComponentState(subdomains);
  })
  */
  
  // 3. Writing (ethereum [of your chosen provider])
  /*
  Now that we have TypeScript classes for each of our semantic entities
  in our data model (i.e. Domain), we can add simple helper functions
  that execute write operations.
  
  For example:
  domain.setName(newName) // only succeed if the ethereumProvider's current address is the domain's owner
  
  domain.somethingMoreComplex(options)
  // inside of this function you can do anything you want, such as
  // - uploading to IPFS
  // - verifying data
  // - calling other Web2 services
  // - and lastly calling into the smart contracts.
  */
  
  // NOTE: here's an example SubgraphProvider https://github.com/daostack/arc.js/blob/2.0.0-experimental.53/src/utils/graphnode.ts
  
  /*
  How to move forward after this info dump?
  1. Setting up GQL type gen for Typescript types
  2. Create your Typescript entity class (class Domain for ex)
  3. Create the context object (ZNS) which has your eth and subgraph providers
  4. Create simple instantiation functions for the Domain class (fromName for ex)
  5a. Implement write operations in public functions
  5b. Implement read operations
  
  Extra Step!
  Create a nice to use React wrapper! (most likely out of scope)
  
  Usage could look like...
  <ZnsProvider config={...}>
    <App />
  </ZnsProvier>
  
  <Domain name={"my.domain"}>
    <Domain.Data>
    {(data) => (
      <div>{data.name}</div>
    )}
    </Domain.Data>
  </Domain>
  
  for reference, see: https://github.com/daostack/arc.react
  */
  