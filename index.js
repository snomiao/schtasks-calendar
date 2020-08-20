// 
// Copyright © 2020 snomiao@gmail.com
// 

const { exec } = require('child_process');
const CSV = require('tsv');
const { readConfig, generateSchtasksCreationObjects, cleanOldSchtasks, importNewSchtasks } = require("./schtasks-calendar");
CSV.sep = ',';
CSV.header = false;

async function main() {
    await exec(`chcp 65001`);
    // READING PARAMS
    const argv = require('yargs')
        .usage('Usage: schcal [options] [...ICS_URLS]')
        .alias('a', 'add-to-schtasks')
        .alias('c', 'config')
        .alias('i', 'ICS_URLS')
        .alias('t', 'CACHE_TIMEOUT')
        .alias('p', 'HTTP_PROXY')
        .alias('d', 'FORWARD_DAYS')
        .alias('v', 'version')
        .example('schcal https://calendar.google.com/calendar/ical/xxxxxxxxxxxxxxxxxxx/private-cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/basic.ics', 'load this ics to schtasks')
        .example('schcal -c config.yaml', 'run with config.yaml')
        .help('h').alias('h', 'help')
        .epilog('Copyright (c) 2020 snomiao@gmail.com')
        .argv;
    if (argv.a) await exec(`./add-to-schtasks.bat`);
    await exec(`title SSAC - READING config`);
    const config = await readConfig(argv);
    await exec(`title SSAC - GENERATING schtasks commands`);
    const schtasksCreationObjects = await generateSchtasksCreationObjects(config);
    await exec(`title SSAC - CLEANING old schtasks`);
    await cleanOldSchtasks(config);
    await exec(`title SSAC - IMPORTING new schtasks`);
    await importNewSchtasks(schtasksCreationObjects);
    return 'done';
}
// RUN cli
if (!module.parent) main().then(console.info).catch(console.error);
module.exports = main
