import { ethers, Wallet } from "ethers";
import { getHubContract, getRegistrar } from "../src/contracts";
import * as dotenv from "dotenv";
import { Registrar, ZNSHub } from "../src/contracts/types";
import { Config, Instance, TokenAllowanceParams } from "../src/types";
import { rinkebyConfiguration } from "../src/configuration";
import { createInstance } from "../src";
import { assert, expect } from "chai";
import * as zAuction from "@zero-tech/zauction-sdk";

dotenv.config();

// Rinkeby Addresses
describe("SDK test", () => {
  let registrar: Registrar;
  let signer: ethers.Signer;

  let config: Config;
  let sdk: Instance;
  let hub: ZNSHub;

  // shkoobyinushnax
  const tokenOnUniNotCG = "0x000000000427e37c32b2be749610c5e4dd7b6d18";
  // King Token
  const tokenOnSushiNotUni = "0x002cdebfce2f5e3fd704da0fa346ad2621353b92"
  const wildTokenMainnet = "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34";
  const randomToken = "0x02b7031e808dbed9b934e8e43beeef0922386ef4";
  const ZNSHubAddress = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";
  const wildToken = "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79";
  const lootToken = "0x5bAbCA2Af93A9887C86161083b8A90160DA068f2";
  const accountThatNeverApproved = "0x0f3b88095e750bdD54A25B2109c7b166A34B6dDb";

  // 0://wilder as hex
  const wilderDomainHex =
    "0x196C0A1E30004B9998C97B363E44F1F4E97497E59D52AD151208E9393D70BB3B";
  // 0://wilder
  const wilderDomain =
    "11498710528894704621672125451994986004212771421624589370395108607834545240891";
  // wilder.pancakes
  const wilderPancakesDomain =
    "0x6e35a7ecbf6b6368bb8d42ee9b3dcfc8404857635036e60196931d4458c07622";
  const wilderCatsDomain =
    "0x617b3c878abfceb89eb62b7a24f393569c822946bbc9175c6c65a7d2647c5402";
  const domainFromBrett =
    "0xada136a490b49f140280941197b1c56cdc9668ec9c8b515c8f00d116b9942c09";

  const pk = process.env.PRIVATE_KEY_ASTRO;
  if (!pk) throw Error("no private key");

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.INFURA_URL,
    4
  );
  const astroWallet = new ethers.Wallet(pk, provider);

  let astroAccount: string;
  let mainAccount: string;
  before(async () => {
    astroAccount = await astroWallet.getAddress();
    mainAccount = "0xaE3153c9F5883FD2E78031ca2716520748c521dB";
    config = rinkebyConfiguration(provider);
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
    const info = sdk.zauction.getPaymentTokenInfo(randomToken);
    await expect(info).to.be.rejectedWith(
      `Token info with address ${randomToken} could not be found`
    );
  });
  it("Gets domains by owner", async () => {
    const domains = await sdk.getDomainsByOwner(astroAccount);
    // 1000 is the max returned in a single call to the subgraph, but there may be more 
    expect(domains.length).to.eq(1000);
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
      wilderPancakesDomain
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
    // By tokenId
    const params = {
      tokenId: wilderPancakesDomain,
    };
    const allowance = await sdk.zauction.getZAuctionSpendAllowance(
      astroAccount,
      params
    );
    expect(allowance).to.not.eq(ethers.BigNumber.from("0"));
  });
  it("get allowance by bid", async () => {
    // By Bid
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

    // By tokenId
    params = {
      tokenId: wilderPancakesDomain,
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
      wilderPancakesDomain
    );
    const isWildOrLoot =
      paymentToken === wildToken || paymentToken === lootToken;
    expect(isWildOrLoot).to.eq(true);
  });
  it("Sets the payment token for a domain to a specific token", async () => {
    // Passes but domain token modifies state, commenting out for other tests
    // const paymentToken = await sdk.zauction.getPaymentTokenForDomain(
    //   wilderPancakesDomain
    // );
    // let tx: ethers.ContractTransaction;
    // if (paymentToken === wildToken) {
    //   tx = await sdk.zauction.setPaymentTokenForDomain(
    //     wilderDomain,
    //     lootToken,
    //     astroWallet
    //   );
    // } else {
    //   tx = await sdk.zauction.setPaymentTokenForDomain(
    //     wilderDomain,
    //     wildToken,
    //     astroWallet
    //   );
    // }
    // await tx.wait(2);
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
    await sdk.getDomainEvents(wilderPancakesDomain);
  });
  it("Confirm listbids working through the SDK", async () => {
    const sdk = createInstance(config);
    const bids = await sdk.zauction.listBids(domainFromBrett);
    const bids2 = await sdk.zauction.listBidsByAccount(
      "0xaE3153c9F5883FD2E78031ca2716520748c521dB"
    );
  });
  it("Get owner of domain", async () => {
    const registrarAddress = await hub.getRegistrarForDomain(
      wilderPancakesDomain
    );
    const registrar = await getRegistrar(provider, registrarAddress);
    const currentOwner = await registrar.ownerOf(wilderPancakesDomain);
  });
  it("Creates an SDK instance and transfers ownership", async () => {
    const config = rinkebyConfiguration(provider);

    // Create two wallets for transfer
    const pk = process.env.TESTNET_PRIVATE_KEY_ASTRO;
    if (!pk) throw Error("Must provide a private key for a signer in .env");
    const walletAstro = new Wallet(pk, provider);

    const pk2 = process.env.TESTNET_PRIVATE_KEY_MAIN;
    if (!pk2) throw Error("Must provide private key");
    const walletMain = new Wallet(pk2, provider);

    const toAddress = await walletMain.getAddress();
    const domainId = wilderPancakesDomain;
    const signer = walletAstro;

    const sdkInstance = createInstance(config);
    // const tx = await sdkInstance.transferDomainOwnership(toAddress, domainId, signer)
  });
});
