// load data file
import yaml from "yaml";
import fs, { mkdir } from "fs/promises";
import { csvParse } from "d3";

const inputPath = "./data/manic";
const outputPath = "./data/dist";

const csvPathParse = async (path) =>
  csvParse((await fs.readFile(path, "UTF8")).replace(/^\ufeff/, ""));
const csvPaths = [
  `${inputPath}/${process.env.COMPUTERNAME}_ManicTimeData.csv`,
  `${inputPath}/SNOBOOK_ManicTimeData.csv`,
];
const csvParseAll = async () =>
  (await Promise.all(csvPaths.map(csvPathParse))).flat();

const data = await csvParseAll();
// parse
import ManicParse from "./index.mjs";
const result = await ManicParse(data);

// output
await mkdir(outputPath, { recursive: true });
const tagPairExport = async ([tag, sects]) =>
  await fs.writeFile(`${outputPath}/tag_${tag}.yaml`, yaml.stringify(sects));
await Promise.all(Object.entries(result).map(tagPairExport));
await fs.writeFile(`${outputPath}/tags.yaml`, yaml.stringify(result));
console.log("tags exported: " + Object.keys(result).join(", "));
