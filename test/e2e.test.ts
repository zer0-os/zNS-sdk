import { ethers, Wallet } from "ethers";
import { getHubContract, getRegistrar } from "../src/contracts";
import * as dotenv from "dotenv";
import { Registrar, ZNSHub } from "../src/contracts/types";
import { Config, Instance } from "../src/types";
import { rinkebyConfiguration } from "../src/configuration";
import { createInstance } from "../src";
import { expect } from "chai";
dotenv.config();

// Rinkeby Addresses
describe("SDK test", () => {
  let registrar: Registrar;
  let signer: ethers.Signer;

  let config: Config;
  let sdk: Instance;
  let hub: ZNSHub;

  const ZNSHubAddress = "0x90098737eB7C3e73854daF1Da20dFf90d521929a";
  const wildToken = "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79";
  const lootToken = "0x5bAbCA2Af93A9887C86161083b8A90160DA068f2";

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

  const pk = process.env.TESTNET_PRIVATE_KEY_ASTRO;
  if (!pk) throw Error("no private key");

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.INFURA_URL,
    4
  );
  const astroWallet = new ethers.Wallet(pk, provider);

  before(async () => {
    config = rinkebyConfiguration(provider);
    hub = await getHubContract(provider, ZNSHubAddress);
    sdk = await createInstance(config);
  });
  it("Ges ERC20 token name and price", async () => {
    const wildInfo = await sdk.zauction.getPaymentTokenInfo(
      wildToken,
      "rinkeby"
    );
    expect(wildInfo.name).to.eq("WILD");
    expect(wildInfo.price).to.exist;
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
        lootToken,
        astroWallet.address,
        ethers.utils.parseEther("1").toString()
      );
    expect(needsToApprove).to.eq(true);

    needsToApprove =
      await sdk.zauction.needsToApproveZAuctionToSpendTokensByPaymentToken(
        wildToken,
        astroWallet.address,
        ethers.utils.parseEther("1").toString()
      );
    expect(needsToApprove).to.eq(false);
  });
  it("Gets buynow sale events", async () => {
    await sdk.getDomainEvents(wilderPancakesDomain);
  });
  it("Confirm listbids working through the SDKlist bids", async () => {
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
