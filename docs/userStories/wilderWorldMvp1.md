# Wilder World MVP

The scope of these stories will be fulfilling the web3 middleware needs of the [Wilder World](https://www.wilderworld.com/) minimally viable product (MVP) (see [Figma](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A0)). They are ordered by priority.

## Developer

1. As a developer, I need good documentation because I want to easily consume this SDK without having to speculate about or reverse engineer its behavior.
2. As a developer, I want easy configuration that works out of the box because I want to have the option to reconfigure the SDK as I need to without being forced to do so. 
3. As a developer, I want to easily **connect, disconnect**, and know when a user's web3 **wallet** is not connected because I do not want to learn how to use web3 libraries to do this myself.
4. As a developer, I need **data** I obtain to **not be stale** before I perform an operation on it so that the end user's web3 transactions do not fail.
5. As a developer, I want to easily obtain read only **mock data** from my function calls, rather than real data, because I need to demo how my dApp will eventually look like with real data.
6. As a developer, I want to easily write **mock data** to the browser's local storage, rather than real data, because I need to write tests that will work for both a demo and production version of my dApp.
7. As a developer, I want to **subscribe** to [**(sub)domain transfer**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L4) and [**metadata locked**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L5) **events** because I need to know precisely when those occur to know when to reload data for the end user.
8. As a developer, I want to **poll** for [**(sub)domain royalties amount changed**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L8), [**metadata unlocked**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L6), and [**(sub)domain metadata changed**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L7) because I need to know eventually when these occur to know when to reload data for the end user.
9. As a developer, I want to be able to obtain **(sub)domain data on demand** because I need to display this to the end user.
10. As a developer, I want to be able to obtain **account (profile) data on demand** because I need to display this to the end user.
11. As a developer, I want to be able to [**register a (sub)domain**](https://github.com/zer0-os/zNS/blob/340c03160e71539128111b7210fb7d6048793463/docs/integration/v1.1/BasicController.json#L126), with locked metadata by default and avoid attempting to register duplicate (subdomains), because I need to support the user creating (sub)domains, avoiding failed transactions, without needed the metadata to be modified or locked afterwards before transferring.
12. As a developer, I want to be able to **lock and unlock sub(domain) metadata** on behalf of the end user (owner) of a sub(domain) because I need to support the end user in their desire to restrict access to this metadata.
13. As a developer, I want to be able to **create or update sub(domain) metadata** on behalf of the end user (owner) of a sub(domain) because I need to support the end user in their desire to make changes to this metadata.
14. As a developer, I need to be able to **set or update the royalty amount of a (sub)domain** because I want to support the end user (owner) in receiving appropriate compensation for their work. 
15. As a developer, I need to be able to edit and create profiles to support the end user in their desire to feel part of an exciting community.
16. Display pending transactions for the user, linking back to specific UI element
17. Call function when transaction completes for a user depending on what object it relates to

## End User

1. As an end user, I need to be able to easily [**connect and disconnect**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A22) my choice **web3 wallet** because I not technical nor interested in debugging my wallet connection.
2. As an end user, I need my **web3 transactions never to fail** because I do not want to waste my ETH on gas fees for failed transactions. (Ethers handles simulating transaction for us already)
3. As an end user, I want to obtain certain [**high level information on each (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A22): its number, its name, its abbreviation, its last bid, its number of bids, its last sale price, its trade price because I want to evaluate whether it is a worthwhile investment and a desirable purchase for me.
4. As an end user, I want to obtain [**certain summary information on each (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A368): its name, its (sub)domain name, its last offer (WILD & USD), its owner, its creator, its image, and its subdomains (see #3) because I want to evaluate whether it is a worthwhile investment and a desirable purchase for me.
5. As an end user, I want to obtain [**certain low level information on each (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A398): its name, its number, its owner, its creator, its (sub)domain, its price (WILD & USD), its story, its views, its edition out of its total editions, its contract address, and its transaction history (offers made, transfers made, offers accepted, when it was created).
6. As an end user, I need to be able to easily [**subscribe (enlist) to a (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A368) because if I consider it a worthwhile investment and a desirable purchase, I will want to be notified when it is available for purchase.
7. As an end user, I need to be able to [**create a (sub)domain** (mint an NFT)](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A896), providing its name, story, image, and creator/owner (myself) because I want to create valuable artworks for others.
8. As an end user, I need to be able to [**transfer a (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A741), providing an address, because I want the flexibility to either use different wallets or give the (sub)domain to someone else.
9.  As an end user, I want to be able to [**create, edit, and view the profiles**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3262%3A314) of (sub)domain creators & owners because I want to feel part of an exciting community.


