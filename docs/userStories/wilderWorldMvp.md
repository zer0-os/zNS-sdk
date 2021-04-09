# Wilder World MVP

The scope of these stories will be fulfilling the web3 middleware needs of the [Wilder World](https://www.wilderworld.com/) minimally viable product (MVP) (see [Figma](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A12))

## Developer

- As a developer, I want to easily connect, disconnect, and know when a user's web3 wallet is not connected because I do not want to learn how to use web3 libraries to do this myself.
- As a developer, I want to easily obtain mock data from my function calls, rather than real data, because I need to demo how my dApp will eventually look like with real data.
- As a developer, I need data I obtain to never be stale so that the end user's web3 transactions do not fail.
- As a developer, I want to subscribe to [domain transfer](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L4) and [metadata locked](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L5) events because I need to know precisely when those occur to know when to reload data for the end user.
- As a developer, I want to poll for [domain royalties amount changed](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L8), [metadata unlocked](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L6), [domain metatdata changed](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L7), and [domain created events](https://github.com/zer0-os/zNS-subgraph/blob/f8969a60f2ad10f811fb36ff56a14f8b5b3af5ec/src/mapping.ts#L3) because I need to know eventually when these occur to know when to reload data for the end user.
- As a developer, I want to be able to [register a domain](https://github.com/zer0-os/zNS/blob/340c03160e71539128111b7210fb7d6048793463/docs/integration/v1.1/BasicController.json#L103) because I need to support the user creating domains.
- As a developer, I want to be able to [register a subdomain](https://github.com/zer0-os/zNS/blob/340c03160e71539128111b7210fb7d6048793463/docs/integration/v1.1/BasicController.json#L126) because I need to support the user creating subdomain.
- As a developer, I want to be able to avoid attempting to register duplicate (sub)domains to support the end user in avoiding failed transactions.
- As a developer, I want to be able to obtain domain data on demand because I need to display this to the end user.
- As a developer, I want to be able to obtain account (profile) data on demand because I need to display this to the end user.

## End User

- As an end user, I need to be able to easily [connect and disconnect](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A908) my choice wallet because I not technical nor interested in debugging my wallet connection.
- As an end user, I want to obtain certain [high level information on each (sub)domain](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A861): its edition number, its name, its abbreviation, its last bid in USD, the number of bids that have been made on it, its last sale price, its trade price because I want to evaluate whether it is a worthwhile investment and a desirable purchase for me.
- As an end user, I want to obtain [certain summary information on each (sub)domain](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3184%3A18537): its name, its domain name, its last offer (WILD & USD), its owner, its creator, its image, and its subdomains because I want to evaluate whether it is a worthwhile investment and a desirable purchase for me.
- As an end user, I want to obtain [certain low level information on each (sub)domain](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A1149): its name, its number, its owner, its creator, its domain, its price (WILD & USD), its story, its views, its edition out of its total editions, its contract address, and its transaction history (offers made, transfers made, offers accepted, when it was created).
- As an end user, I need to be able to easily buy a (sub)domain because if I consider it a worthwhile investment and a desirable purchase, I will want to own it.
- As an end user, I want to be able to create, edit, and view the profiles of domain creators & owners because I want to feel part of an exiciting community.
- As an end user, I need to be able to [create a (sub)domain (mint an NFT)](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A1731) because I want to create valuable artworks for others.
- As an end user, I need to be able to [transfer a (sub)domain](https://www.figma.com/file/5bOkQKkrQ2jCZR6N3oUCMj/ZNS-Front-End?node-id=3151%3A1539) because I want the flexibility to either use different wallets or give the (sub)domain to someone else.
- As an end user, I need to securely modify the metadata of a (sub)domain that I own because I need to be able to correct problems or make updates to it.
- As an end user, I need my web3 transactions never to fail because I do not want to waste my ETH on gas fees for failed transactions.

