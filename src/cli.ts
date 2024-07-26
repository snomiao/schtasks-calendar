#!/usr/bin/env bun
/**
 * schtasks-calendar (schcal)
 * Author: snomiao (snomiao@gmail.com)
 * 2020-2021
 */
import snorun from "snorun";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  generateSchtasksCreationObjects,
  newSchtasksImport,
  outdatedSchtasksClean,
  readConfig,
} from "./index";

await snorun(`chcp 65001`);
// READING PARAMS
const argv = await yargs(hideBin(process.argv))
  .usage("Usage: schcal [options] [...ICS_URLS]")
  .alias("c", "config")
  .alias("d", "FORWARD_DAYS")
  .alias("h", "help")
  .alias("i", "ICS_URLS")
  .alias("p", "HTTP_PROXY")
  .alias("s", "startup")
  .alias("t", "CACHE_TIMEOUT")
  .alias("v", "version")
  .string("config")
  .describe("config", "config path")
  .number("CACHE_TIMEOUT")
  .number("FORWARD_DAYS")
  .string("HTTP_PROXY")
  .string("ICS_URLS")
  .array("ICS_URLS")
  // .positional("ICS_URLS")
  .example(
    "$0 https://calendar.google.com/calendar/ical" +
      "/xxxxxxxxxxxxxxxxxxx/private-cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/basic.ics",
    "load this ics to schtasks, \n get your ics url from https://calendar.google.com/calendar/u/0/r/settings"
  )
  .example("schcal -c config.yaml", "run with config.yaml")
  .epilog("Copyright (c) 2020 snomiao@gmail.com").argv;
argv.ICS_URLS = (argv.ICS_URLS ?? []).concat(argv._.map(String) ?? []);
if (argv.startup) await snorun(`./add-to-schtasks.bat`);
await snorun(`title SSAC - READING config`);
const config = await readConfig(argv);
await snorun(`title SSAC - GENERATING schtasks commands`);
const schtasksCreationObjects = await generateSchtasksCreationObjects(config);
await snorun(`title SSAC - CLEANING old schtasks`);
await outdatedSchtasksClean(config);
await snorun(`title SSAC - IMPORTING new schtasks`);
await newSchtasksImport(schtasksCreationObjects);
