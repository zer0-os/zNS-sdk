# zNS-sdk User Stories

These user stories define the desired user experience for the zNS SDK. The intial scope of these stories will be fulfilling the web3 middleware needs of the [Wilder World](https://www.wilderworld.com/) product (see [Figma](https://www.figma.com/file/eJ1XynVpNeHBUeXwaLLWfO/Zer0-UI-Design?node-id=5389%3A0)) We have identified two user types for this product:

- Developer: a front end developer building the Wilder World app using the zNS SDK. We assume they have knowledge of front end technologies and frameworks but limited or no knowledge of web3 technologies such as subgraphs, smart contracts, wallets, etc.
- End User: a user of Wilder World that uses the zNS SDK. We assume that they have basic knowledge of wallets but are, otherwise, completely non-technical.

This means that we have two broad categories of user stories: those for Developers and those for End Users.
Here is our user story template:
As {who} {when} {where}, I {want} because {why}

## Developer

- As a developer, I want to easily connect, disconnect, and know when a user's web3 wallet is not connected because I do not want to figure this out myself.
- As a developer, I want to easily obtain mock data, rather than real data, because I need to sometimes demo how my dApp will eventually look like.

## End User

- As an end user, I want to be able to easily connect and disconnect my choice wallet because...
- As an end user, I want to obtain [information on WILD](https://www.figma.com/file/eJ1XynVpNeHBUeXwaLLWfO/Zer0-UI-Design?node-id=5389%3A84) (including current price [USD & BTC], its market cap, its price change over time [daily, weekly, monthly], and the total wallets holding it) because...
- As an end user, I want to obtain certain [high level information on each NFT](https://www.figma.com/file/eJ1XynVpNeHBUeXwaLLWfO/Zer0-UI-Design?node-id=5389%3A84) (including its name, its number current trade price in USD & WILD, its last traded price in USD & WILD, its market cap, its volume, its price change over time [daily and weekly], its supply, its owner) because...
- As an end user, I want to obtain [certain summary information on each NFT](https://www.figma.com/file/eJ1XynVpNeHBUeXwaLLWfO/Zer0-UI-Design?node-id=5432%3A0) (its last price [WILD], its change in price, its owner, its creator, its image) because...
- As an end user, I want to obtain [certain low level information on each NFT](https://www.figma.com/file/eJ1XynVpNeHBUeXwaLLWfO/Zer0-UI-Design?node-id=5466%3A71) (its edition number, its lowest price [USD & LOOT], its highest price [USD & LOOT], its available editions, the price of each available addition [USD & WILD], its last traded price, its average resale price, and its original price, its story, its price vs. its supply/growth [daily, weekly, monthly], its market stats [number of collectors, number for sale, number of editions minted, its mint ratio, its original market price, its highest active fee, its tokens distributed, the date it was created], its history [transaction/bid and global history], comments on it) because...
- As an end user, I want to be able to easily make an offer on an NFT because...
- As an end user, I want to be able to easily stake my token on an NFT because...
- As an end user, I want to be able to easily comment on an NFT because...

