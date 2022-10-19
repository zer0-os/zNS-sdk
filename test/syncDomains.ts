import { ethers } from "ethers";
import * as fs from "fs";
import {
  Config,
  configuration,
  createInstance,
  Domain,
  Instance,
} from "../src";
import { Registrar, Registrar__factory } from "../src/contracts/types";

const getLabel = (name: string) => {
  if (name === null) return "";
  const labels = name.split(".");
  return labels.length > 0 ? labels[labels.length - 1] : "";
};

const getAllDomains = async (): Promise<Domain[]> => {
  const rinkebyConfig: Config = configuration.rinkebyConfiguration(
    ethers.providers.getDefaultProvider(ethers.providers.getNetwork("rinkeby"))
  );

  const zNSInstance = createInstance(rinkebyConfig);

  // list all the domains
  const domains = await zNSInstance.getAllDomains();
  // console.log(domains);

  const rootDomain = await zNSInstance.getDomainById(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    false
  );
  console.log("rootDomain", rootDomain);

  // sort by domain hierachies
  domains.sort((domainA: Domain, domainB: Domain) => {
    const labelsA = domainA.name.split(".");
    const labelsB = domainB.name.split(".");
    if (labelsA.length !== labelsB.length) {
      return labelsA.length < labelsB.length ? -1 : 1;
    }
    return domainA.name.localeCompare(domainB.name);
  });

  return domains;
};

const getParentDomain = async (
  zNSInstance: Instance,
  domain: Domain
): Promise<Domain | null> => {
  const parentDomainName = domain.name.split(".").slice(0, -1).join(".");

  const domains = await zNSInstance.getDomainsByName(parentDomainName);
  const parentDomain = domains.filter(
    (domain) => domain.name === parentDomainName
  );
  return parentDomain.length > 0 ? parentDomain[0] : null;
};

const addFailedDomain = async (domain: Domain) => {
  const text = fs.readFileSync("./failed-domains.json", "utf-8");
  const domains =
    text.length < 1 ? [] : (JSON.parse(text) as unknown as Domain[]);
  domains.push(domain);
  fs.writeFileSync("./failed-domains.json", JSON.stringify(domains), "utf-8");
};

const registerDomain = async (
  registrar: Registrar,
  parentDomain: Domain,
  domain: Domain
) => {
  const tx = await registrar.registerDomain(
    parentDomain.id,
    getLabel(domain.name),
    domain.minter,
    domain.metadataUri,
    0,
    false
  );
  await tx.wait();
};

const main = async () => {
  const allDomains = await getAllDomains();

  const goerliProvider = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/fa959ead3761429bafa6995a4b25397e"
  );
  const goerliConfig: Config =
    configuration.goerliConfiguration(goerliProvider);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, goerliProvider);
  const registrarAddress = "0x009A11617dF427319210e842D6B202f3831e0116";

  const zNSInstance = createInstance(goerliConfig);
  const registrar = Registrar__factory.connect(registrarAddress, signer);

  for (const domain of allDomains) {
    if (domain.name === null) continue;

    const parentDomain = await getParentDomain(zNSInstance, domain);
    if (!parentDomain) {
      addFailedDomain(domain);
    } else {
      console.log('registering domain', domain);
      await registerDomain(registrar, parentDomain, domain);
    }
  }
};

main().catch(console.error);
