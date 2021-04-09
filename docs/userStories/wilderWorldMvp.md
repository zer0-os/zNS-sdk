# Wilder World MVP

The scope of these stories will be fulfilling the web3 middleware needs of the [Wilder World](https://www.wilderworld.com/) minimally viable product (MVP) (see [Figma](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A12)). They are ordered by priority.

## Developer

1. As a developer, I want to easily **connect, disconnect**, and know when a user's web3 **wallet** is not connected because I do not want to learn how to use web3 libraries to do this myself.
2. As a developer, I need **data** I obtain to **not be stale** before I perform an operation on it so that the end user's web3 transactions do not fail.
3. As a developer, I want to easily obtain **mock data** from my function calls, rather than real data, because I need to demo how my dApp will eventually look like with real data.
4. As a developer, I want to **subscribe** to [**(sub)domain transfer**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L4) and [**metadata locked**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L5) **events** because I need to know precisely when those occur to know when to reload data for the end user.
5. As a developer, I want to **poll** for [**(sub)domain royalties amount changed**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L8), [**metadata unlocked**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L6), [**(sub)domain metatdata changed**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L7), and [**(sub)domain created events**](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L3) because I need to know eventually when these occur to know when to reload data for the end user.
6. As a developer, I want to be able to obtain **(sub)domain data on demand** because I need to display this to the end user.
7. As a developer, I want to be able to obtain **account (profile) data on demand** because I need to display this to the end user.
8. As a developer, I want to be able to [**register a (sub)domain**](https://github.com/zer0-os/zNS/blob/340c03160e71539128111b7210fb7d6048793463/docs/integration/v1.1/BasicController.json#L126), with locked metadata by default and avoid attempting to register duplicate (subdomains), because I need to support the user creating (sub)domains, avoiding failed transactions, without needed the metadata to be modified or locked afterwards before transferring.
9. As a developer, I want to be able to **lock and unlock sub(domain) metadata** on behalf of the end user (owner) of a sub(domain) because I need to support the end user in their desire to restrict access to this metadata.
10. As a developer, I want to be able to **create or update sub(domain) metadata** on behalf of the end user (owner) of a sub(domain) because I need to support the end user in their desire to make changes to this metadata.
11. As a developer, I need to be able to **set or update the royalty amount of a (sub)domain** because I want to support the end user (owner) in receiving appropriate compensation for their work. 
12. As a developer, I need to be able to edit and create profiles to support the end user in their desire to feel part of an exciting community.

## End User

1. As an end user, I need to be able to easily [**connect and disconnect**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A908) my choice **web3 wallet** because I not technical nor interested in debugging my wallet connection.
2. As an end user, I need my **web3 transactions never to fail** because I do not want to waste my ETH on gas fees for failed transactions.
3. As an end user, I want to obtain certain [**high level information on each (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A861): its edition number, its name, its abbreviation, its last bid in USD, the number of bids that have been made on it, its last sale price, its trade price because I want to evaluate whether it is a worthwhile investment and a desirable purchase for me.
4. As an end user, I want to obtain [**certain summary information on each (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3184%3A18537): its name, its (sub)domain name, its last offer (WILD & USD), its owner, its creator, its image, and its subdomains because I want to evaluate whether it is a worthwhile investment and a desirable purchase for me.
5. As an end user, I want to obtain [**certain low level information on each (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A1149): its name, its number, its owner, its creator, its (sub)domain, its price (WILD & USD), its story, its views, its edition out of its total editions, its contract address, and its transaction history (offers made, transfers made, offers accepted, when it was created).
6. As an end user, I need to be able to easily **buy a (sub)domain** because if I consider it a worthwhile investment and a desirable purchase, I will want to own it.
8. As an end user, I need to be able to [**create a (sub)domain** (mint an NFT)](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A1731) because I want to create valuable artworks for others.
9. As an end user, I need to be able to [**transfer a (sub)domain**](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A1539) because I want the flexibility to either use different wallets or give the (sub)domain to someone else.
10.  As an end user, I need to **lock & unlock the metadata of a (sub)domain** that I own because I want to prevent others from modifying it immediately after I create and maybe after I transfer it to them.
11. As an end user, I need to securely **modify the** unlocked **metadata of a (sub)domain** that I own because I need to be able to correct problems or make updates to it.
12. As an end user, I need to be able to **set or update the royalty amount for (sub)domains** I own because I want to have the appropriate compensation for my work. 
13. As an end user, I want to be able to **create, edit, and view the profiles** of (sub)domain creators & owners because I want to feel part of an exciting community.


