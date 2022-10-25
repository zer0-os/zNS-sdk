import { ethers } from "ethers";
import { getHubContract, getRegistrar } from "../src/contracts";
import * as dotenv from "dotenv";
import { Registrar, ZNSHub } from "../src/contracts/types";
import { Config, Instance, TokenAllowanceParams } from "../src/types";
import { goerliConfiguration, rinkebyConfiguration } from "../src/configuration";
import { createInstance } from "../src";
import { assert, expect } from "chai";
import * as zAuction from "@zero-tech/zauction-sdk";

dotenv.config();

// Goerli Addresses
describe("SDK test", () => {
  let registrar: Registrar;
  let signer: ethers.Signer;

  let config: Config;
  let sdk: Instance;
  let hub: ZNSHub;

  // Mainnet for other token addresses to be resolved by coin gecko / uniswap / sushiswap
  // shkoobyinushnax
  const tokenOnUniNotCG = "0x000000000427e37c32b2be749610c5e4dd7b6d18";
  // King Token
  const tokenOnSushiNotUni = "0x002cdebfce2f5e3fd704da0fa346ad2621353b92";
  const wildTokenMainnet = "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34";
  const randomToken = "0x02b7031e808dbed9b934e8e43beeef0922386ef4";

  const ZNSHubAddress = "0xce1fE2DA169C313Eb00a2bad25103D2B9617b5e1";
  const lootToken = "0x196bc789E03761904E3d7266fa57f2001592D25A";
  const accountThatNeverApproved = "0x0f3b88095e750bdD54A25B2109c7b166A34B6dDb"; // random account

  const meowDomain = "0x6b9d6f1edf4b298f7edbfe917276cd16b632cc6062109192f4880c5a45d5d34e";
  const wilderDomain = "0x196c0a1e30004b9998c97b363e44f1f4e97497e59d52ad151208e9393d70bb3b";
  const wilderWheelsDomain = "0x7445164548beaf364109b55d8948f056d6e4f1fd26aff998c9156b0b05f1641f";
  const wildToken = "0x0e46c45f8aca3f89Ad06F4a20E2BED1A12e4658C";

  const pk = process.env.PRIVATE_KEY_ASTRO;
  if (!pk) throw Error("no private key");

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.INFURA_URL,
    5
  );
  const astroWallet = new ethers.Wallet(pk, provider);

  let astroAccount: string;
  let mainAccount: string;
  before(async () => {
    astroAccount = await astroWallet.getAddress();
    mainAccount = "0xaE3153c9F5883FD2E78031ca2716520748c521dB";
    config = goerliConfiguration(provider);
    hub = await getHubContract(provider, ZNSHubAddress);
    sdk = await createInstance(config);
  });
  it("Gets ERC20 token name, symbol, price, and decimals", async () => {
    const info = await sdk.zauction.getPaymentTokenInfo(wildTokenMainnet);
    expect(info.symbol).to.eq("WILD");
  });
  it("Gets ERC20 token price when not on CoinGecko using derivedEth from Uniswap", async () => {
    const info = await sdk.zauction.getPaymentTokenInfo(tokenOnUniNotCG);
    expect(info.symbol).to.eq("SHKOOBYSHNAX");
  });
  it("Reaches out to Sushiswap for a coin that's not on Uniswap", async () => {
    const info = await sdk.zauction.getPaymentTokenInfo(tokenOnSushiNotUni);
    expect(info.symbol).to.eq("KING");
  });
  it("Fails when token is not found", async () => {
    return await sdk.zauction.getPaymentTokenInfo(randomToken)
      .catch(error => {
        const expectedMessage = `Token info with address ${randomToken} could not be found`;
        expect(error.message).to.eq(expectedMessage);
    });
  });
  it("Gets domains by owner with default to DataStoreApi", async () => {
    const domains = await sdk.getDomainsByOwner(mainAccount);

    expect(domains.length).to.be.gt(0);
  });
  it("Gets domains by owner using the Subgraph", async () => {
    const domains = await sdk.getDomainsByOwner(mainAccount, false);

    expect(domains.length).to.be.gt(0);
  });
  xit("Validates that returns from the subgraph and data store API are the same", async (done) => {
    // # of domains and locked status still bugged post 2.1 updates.
    const dataStoreDomains = await sdk.getDomainsByOwner(astroAccount, true);
    const subgraphDomains = await sdk.getDomainsByOwner(astroAccount, false);

    const dataStoreDomainIds = dataStoreDomains.map((domain) => {
      return domain.id
    });

    const subgraphDomainIds = subgraphDomains.map((domain) => {
      return domain.id
    });

    expect(subgraphDomainIds).to.deep.equal(dataStoreDomainIds);
    done();
  });
  it("Gets a user's balance of a specific ERC20 token", async () => {
    const balance = await sdk.zauction.getUserBalanceForPaymentToken(
      astroAccount,
      wildToken
    );
    assert(balance.gt("0"));
  });
  it("Gets a user's balance of a specific ERC20 token through a domain", async () => {
    const balance = await sdk.zauction.getUserBalanceForPaymentTokenByDomain(
      astroAccount,
      wilderDomain
    );
    assert(balance.gt(0));
  });
  it("Returns 0 when a user has none of the specified token", async () => {
    const balance = await sdk.zauction.getUserBalanceForPaymentToken(
      mainAccount,
      lootToken
    );
    assert(balance.eq(0));
  });
  it("Gets the spend allowance", async () => {
    // By paymentTokenAddress
    const params: TokenAllowanceParams = {
      paymentTokenAddress: wildToken,
    };
    let allowance = await sdk.zauction.getZAuctionSpendAllowance(
      astroAccount,
      params
    );

    expect(allowance).to.not.eq(ethers.BigNumber.from("0"));
  });
  it("gets allowance by tokenId", async () => {
    const params = {
      tokenId: wilderWheelsDomain,
    };
    const allowance = await sdk.zauction.getZAuctionSpendAllowance(
      astroAccount,
      params
    );
    expect(allowance).to.not.eq(ethers.BigNumber.from("0"));
  });
  it("get allowance by bid", async () => {
    const params = {
      bid: {
        tokenId: wildToken,
      } as zAuction.Bid,
    };
    const allowance = await sdk.zauction.getZAuctionSpendAllowance(
      astroAccount,
      params
    );
    expect(allowance).to.not.eq(ethers.BigNumber.from("0"));
  });
  it("gets legacy allowance", async () => {
    const params = {};
    const allowance = await sdk.zauction.getZAuctionSpendAllowance(
      astroAccount,
      params
    );
    expect(allowance).to.not.eq(ethers.BigNumber.from("0"));
  });
  it("Always returns 0 for an account that has never approved", async () => {
    // By paymentTokenAddress
    let params: TokenAllowanceParams = {
      paymentTokenAddress: wildToken,
    };
    let allowance = await sdk.zauction.getZAuctionSpendAllowance(
      accountThatNeverApproved,
      params
    );
    assert(allowance.eq(ethers.BigNumber.from("0")));

    params = {
      tokenId: wilderDomain,
    };
    allowance = await sdk.zauction.getZAuctionSpendAllowance(
      accountThatNeverApproved,
      params
    );
    assert(allowance.eq(ethers.BigNumber.from("0")));

    // by Bid
    params = {
      bid: {
        tokenId: wildToken,
      } as zAuction.Bid,
    };
    allowance = await sdk.zauction.getZAuctionSpendAllowance(
      accountThatNeverApproved,
      params
    );
    assert(allowance.eq(ethers.BigNumber.from("0")));

    params = {};
    allowance = await sdk.zauction.getZAuctionSpendAllowance(
      accountThatNeverApproved,
      params
    );
    assert(allowance.eq(ethers.BigNumber.from("0")));
  });
  it("Gets the payment token for that domain", async () => {
    const paymentToken = await sdk.zauction.getPaymentTokenForDomain(
      wilderWheelsDomain
    );
    const isWildOrLoot =
      paymentToken === wildToken || paymentToken === lootToken;
    expect(isWildOrLoot).to.eq(true);
  });
  it("Checks if a user needs to approve the trade token several ways", async () => {
    // User is not approved for any loot token, so they do need to approve
    let needsToApprove =
      await sdk.zauction.needsToApproveZAuctionToSpendTokensByPaymentToken(
        astroWallet.address,
        lootToken,
        ethers.utils.parseEther("1").toString()
      );
    expect(needsToApprove).to.eq(true);

    needsToApprove =
      await sdk.zauction.needsToApproveZAuctionToSpendTokensByPaymentToken(
        astroWallet.address,
        wildToken,
        ethers.utils.parseEther("1").toString()
      );
    expect(needsToApprove).to.eq(false);
  });
  it("Gets buynow sale events", async () => {
    await sdk.getDomainEvents(wilderDomain);
  });
  it("Confirm listbids working through the SDK", async () => {
    const sdk = createInstance(config);
    const bids = await sdk.zauction.listBids(wilderDomain);
    const bids2 = await sdk.zauction.listBidsByAccount(
      "0xaE3153c9F5883FD2E78031ca2716520748c521dB"
    );
  });
  it("Get owner of domain", async () => {
    const registrarAddress = await hub.getRegistrarForDomain(
      wilderDomain
    );
    const registrar = await getRegistrar(provider, registrarAddress);
    const currentOwner = await registrar.ownerOf(wilderDomain);
  });
});
