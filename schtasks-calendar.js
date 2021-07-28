/**
 * schtasks-calendar (schcal)
 * Author: snomiao (snomiao@gmail.com)
 * 2020-2021
 */
const escapeFile = require('escape-filename')
const sha256 = require('crypto-js/sha256')
const fs = require('fs')
const yaml = require('yaml')
const { exec } = require('child_process')
const { promisify } = require('util')

const innerText = (s) => unescapeHTML(s.replace(/<br.*?>/g, '\n').replace(/\<.*?\>/g, ''))
function unescapeHTML(unsafe) {
    return unsafe
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}
const { env } = require('process');
const CSV = require('tsv');
const { mkCommandWrapperFile } = require("./mkCommandWrapperFile.js");
const { icalObjectFetch } = require("./icalObjectFetch.js");
CSV.sep = ',';
CSV.header = false;

// RUN cli
if (!module.parent) main().then(console.info)
// .catch(console.error);
module.exports = main

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

async function importNewSchtasks(schtasksCreationObjects) {
    const schtasksCreationCommands = schtasksCreationObjects.map(({ schtasksCommand }) => schtasksCommand);
    const creactionErrors = await runSchtasksCommands(schtasksCreationCommands);
    if (creactionErrors.length) {
        console.error('creactionErrors: ', creactionErrors);
        process.exit(1)
    }
    console.log(`${schtasksCreationCommands.length} sch-tasks added.`);
}
exports.importNewSchtasks = importNewSchtasks;

async function cleanOldSchtasks(config) {
    // await exec('chcp 65001'); // run below command in utf8 encoding
    const csv = CSV.parse((await promisify(exec)("schtasks /query /fo csv /nh")).stdout);
    const ssacTaskNames = csv.map(([taskPath]) => taskPath.slice(1)).filter(e => e).filter(e => e.startsWith(config.SSAC_PREFIX));
    const schtasksDeletionCommands = ssacTaskNames.map(taskName => `schtasks /Delete /tn ${getSafeCommandParamString(taskName)} /F`);
    // console.log(schtasksDeletionCommands)
    const deletionErrors = await runSchtasksCommands(schtasksDeletionCommands);
    if (deletionErrors.length) {
        console.error('deletionErrors: ', deletionErrors)
        process.exit(1)
    }
    console.log(`${schtasksDeletionCommands.length} old sch-tasks cleaned.`);
}
exports.cleanOldSchtasks = cleanOldSchtasks;

async function readConfig(argv) {
    const configYAMLs =
        await Promise.all(
            [argv.config, env.CONFIG, 'config.yaml', env.USERPROFILE + '/.schcal/config.yaml'].reverse()
                .filter(fs.existsSync)
                .map(async configPath => yaml.parse(await fs.promises.readFile(configPath, 'utf-8')))
        )
    const configFromYAMLs = configYAMLs
        .reduce((a, b) => ({ ...a, ...b }), {})
    argv.ICS_URLS = [configFromYAMLs.ICS_URLS, argv.ICS_URLS, argv._].flat().filter(e => e);
    const config = {
        SSAC_PREFIX: 'SSAC-',
        FORWARD_DAYS: 7,
        HTTP_PROXY: '',
        CACHE_TIMEOUT: 0,
        ...env,
        ...configFromYAMLs,
        ...argv,
    };
    process.env.HTTP_PROXY ||= config.HTTP_PROXY
    return config;
}
exports.readConfig = readConfig;

async function runSchtasksCommands(schtasksCommands) {
    // await exec('chcp 65001'); // run below command in utf8 encoding
    const exec_outputs = await Promise.all(
        schtasksCommands.map(async (schtasksCommand) => ({ schtasksCommand, ...await promisify(exec)(schtasksCommand) })
        ));
    const outputsWithStderr = exec_outputs.filter(({ stderr }) => stderr);
    // console.log('errors', outputsWithStderr)
    return outputsWithStderr;
}

async function generateSchtasksCreationObjects(config) {
    const { ICS_URLS, HTTP_PROXY, CACHE_TIMEOUT, FORWARD_DAYS, SSAC_PREFIX } = config;
    if (!ICS_URLS?.length) {
        console.error('CONFIG ERROR... ICS_URLS is empty, maybe you should write a config file or put a ics URL as a param...\nMore infomation can be found in https://github.com/snomiao/schtasks-calendar')
        process.exit(1);
    }
    const actions = await fetchCalendarsEventsActions(ICS_URLS, CACHE_TIMEOUT, HTTP_PROXY, FORWARD_DAYS);
    return (await Promise.all(actions
        .map(async ({ taskName, startDateString, endDateString, commandOrURL }) => {
            // console.log({ startDateString, endDateString, commandOrURL });
            const schtasksObject = await getSchtasksObject(taskName, startDateString, endDateString, commandOrURL, SSAC_PREFIX);
            // console.log(schtasksObject);
            return schtasksObject;
        })))
        .sort((a, b) => a.schtasksName.localeCompare(b.schtasksName))
        .map(e => (console.log(e.schtasksName), e))

}

// [Exe文件开机启动，隐藏运行窗口运行_问道-CSDN博客_开机隐藏运行exe]( https://blog.csdn.net/llag_haveboy/article/details/84675145 )
// `wscript.createObject("wscript.shell").Run("cmd.exe /C C:\gz\gz.exe", 0, TRUE)`
exports.generateSchtasksCreationObjects = generateSchtasksCreationObjects;
async function getSchtasksObject(taskName, startDateString, endDateString, commandOrURL, SSAC_PREFIX) {
    const S = DateTimeAssembly(currentTimeZoneDateDecompose(new Date(startDateString)));
    const E = DateTimeAssembly(currentTimeZoneDateDecompose(new Date(endDateString)));
    // const dateParams = `/SC ONCE /SD ${S.D} /ST ${S.T} /ED ${E.D} /ET ${E.T} /Z`; // the option ONCE does not support /ED (and /Z)
    // const dateParams = `/SC ONCE /SD ${S.D} /ST ${S.T} /ET ${E.T} /Z`; // /ET is used to repeat tasks and runs every 10 minutes if there is a /ET.
    // const dateParams = `/SC ONCE /SD ${S.D} /ST ${S.T} /Z`; // ERROR: Need End Boundary
    // const dateParams = `/SC DAILY /SD ${S.D} /ST ${S.T} /ED ${E.D} /ET ${E.T} /Z`; // OK
    const dateParams = `/SC ONCE /SD ${S.D} /ST ${S.T}`; // OK BUT will not delete task after complete..

    // [schtasks | Microsoft Docs]( https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/schtasks )
    const taskStartDate = new Date(startDateString);
    const taskStartDateShortString = new Date(new Date(startDateString) - new Date().getTimezoneOffset() * 60e3).toISOString().replace(/[^\dT]/g, '').replace('T', '-').slice(4, 8 + 4 + 1);
    const taskID = taskStartDate.toISOString() + '-' + commandOrURL;
    const taskHash = sha256(taskID);
    const schtasksName = SSAC_PREFIX + `${taskStartDateShortString}-${taskName}`;
    // console.log(schtasksName);
    // TODO FIXME: 貌似普通指令没有静默成功…… 
    //
    // defaults to use a wrapper
    // const slientlyRunCommandRaw = isUrl(commandOrURL) ? 'explorer ' + `"${escapeCommand(commandOrURL)}"` : 'CMD /c start "SSAC" "' + escapeCommand(commandOrURL) + '"'
    // const slientlyRunCommand = (slientlyRunCommandRaw.length <= 250) ? slientlyRunCommandRaw : await mkCommandWrapperFile(taskHash, slientlyRunCommandRaw)
    //
    // 全部使用wrapper
    const slientlyRunCommand = await mkCommandWrapperFile(taskHash, commandOrURL)
    // 
    const safeTaskname = getSafeCommandParamString(escapeFile.escape(schtasksName.slice(0, 200)).replace(/[<>\/\\:~%"']/g, '-'))
    const safeTR = getSafeCommandParamString(slientlyRunCommand)
    const taskParams = `/TN ${safeTaskname} /TR ${safeTR}`;
    // console.log(taskParams);
    const schtasksCommand = `schtasks /Create /F ${dateParams} ${taskParams}`;
    // ref: [windows - How do you schedule a task (using schtasks.exe) to run once and delete itself? - Super User]( https://superuser.com/questions/1038528/how-do-you-schedule-a-task-using-schtasks-exe-to-run-once-and-delete-itself )
    return { schtasksName, schtasksCommand };
    function escapeCommand(cmd) { return cmd.replace(/&/g, '^&').replace(/%/g, '%%') }
}
function currentTimeZoneDateDecompose(date) {
    const [, 年, 月, 日, 时, 分, 秒, 毫秒] = new Date(+date - new Date().getTimezoneOffset() * 60e3)
        .toISOString().match(/(....)-(..)-(..)T(..):(..):(..)\.(...)Z/);
    return { 年, 月, 日, 时, 分, 秒, 毫秒 };;
}
function getSafeCommandParamString(串) {
    return '"' + 串.replace(/"/g, '\\"') + '"';
}
function DateTimeAssembly(分解时刻) {
    const { 年, 月, 日, 时, 分, 秒 } = 分解时刻;
    return { D: [月, 日, 年].join('/'), T: [时, 分, 秒].join(':') };
}

async function fetchCalendarsEventsActions(ics_urls, cacheTimeout, httpProxy, FORWARD_DAYS) {
    return (await Promise.all(ics_urls.map(async (ics_url) => await fetchCalendarEventsActions(ics_url, cacheTimeout, httpProxy, FORWARD_DAYS)))).flat(1);
}

async function fetchCalendarEventsActions(ics_url, cacheTimeout, httpProxy, FORWARD_DAYS) {
    const icalObject = await icalObjectFetch(ics_url, cacheTimeout, httpProxy);
    const actions = parseCalendarEventsActions(icalObject, FORWARD_DAYS);
    return actions;
}
function parseCalendarEventsActions(icalObject, FORWARD_DAYS) {
    return Object.values(icalObject).map(vEvent => {
        if (vEvent.type !== "VEVENT")
            return;
        const [rangeStart, rangeEnd] = [+new Date(), +new Date() + FORWARD_DAYS * 86400e3]; // FORWARD_DAYS days from now
        const events = getRangeEvents(vEvent, rangeStart, rangeEnd);
        const actions = getEventsActions(events);
        // events.length && console.debug('events', events);
        // actions.length && console.debug('actions', actions.flat());
        return actions;
    }).filter(e => e).flat(1);
}
function getEventsActions(events) {
    return events.flatMap(getEventActions).filter(e => e);
}
function getEventActions(event) {
    const { start, end, summary, description } = event;
    const action = null
        || runCommandMatch(event)
        || linkMatch(event)
    return action && [{
        startDateString: start.toLocaleString(),
        endDateString: end.toLocaleString(),
        ...action,
        taskName: action.taskName || summary,
    }]
}

function runCommandMatch(event) {
    // BEWARE the description can be plain text OR HTML but what we just want want a plain text.
    const description = innerText(event?.description || '') // ASSUME THE HTML IS GOOD AT FORMAT
    // description.match('share') && console.debug(description);
    const summary = event?.summary
    //
    const matchedContent = null
        || (summary?.match(/^启动\s+([\s\S]*)/mi))
        || (description?.match(/^启动\s+([\s\S]*)/mi))
        || (summary?.match(/^RUN\s+(.*)/mi))
        || (description?.match(/^RUN\s+(.*)/mi))
    return matchedContent && (() => {
        return { commandOrURL: matchedContent[1] };
    })();
}
function linkMatch(event) {
    // BEWARE the description can be plain text OR HTML but what we just want want a plain text.
    const description = innerText(event?.description || '') // ASSUME THE HTML IS GOOD AT FORMAT
    const summary = event?.summary
    // markdown style
    const matchedContent = summary?.match(/\[\s*(.*?)\s*?\]\(\s*(.*?)\s*?\)/)
        || description?.match(/\[\s*(.*?)\s*?\]\(\s*(.*?)\s*?\)/)
        || summary?.match(/(.*)((?:https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/)
        || description?.match(/(.*)((?:https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/)

    return matchedContent && (() => {
        const [, 标题, 链接] = matchedContent;
        return { commandOrURL: 链接, taskName: 标题 };
    })();
}
function getRangeEvents(vEvent, rangeStart, rangeEnd) {
    const { summary, description, start, end, rrule, recurrences, exdate } = vEvent;
    // Calculate the duration of the event for use with recurring 事件.
    const duration = (+end) - (+start);
    // avoid error 
    const _recurrences = recurrences || [];
    const _exdate = exdate || [];
    // exdate == [ '2020-03-05': 2020-03-05T09:30:00.000Z { tz: 'Asia/Hong_Kong' } ]
    const exdatesKeys = Object.keys(_exdate); // datestr or undefined
    // exdatesKeys == [ '2020-03-05' ]
    const recurrencesKeys = Object.keys(_recurrences); // datestr or undefined
    // recurrencesKeys == [ '2020-03-05' ]
    // 
    // First determine a fuzzy range date here, and then filter after calculating the precise beginning and end time
    const dates = [start]
        // join rules dates
        .concat(rrule?.between(new Date(rangeStart), new Date(rangeEnd)) || [])
        // exlude dates
        .filter(date => !exdatesKeys.includes(date.toISOString().slice(0, 10)))
        // override recurrences
        .filter(date => !recurrencesKeys.includes(date.toISOString().slice(0, 10)))
        .concat(Object.values(_recurrences).map(({ start }) => start));

    // summary == '背词' && console.debug('dates', dates);
    return dates.map((date) => {
        if (_recurrences?.[date.toISOString().slice(0, 10)]) {
            const { start, end, summary, description } = vEvent;
            return { start, end, summary, description };
        }
        const start = date;
        const end = new Date(+start + duration);
        return { start, end, summary, description };
    }).filter(e => e)
        // Filter the dates...
        .filter(({ start, end }) => +rangeStart < +end && +rangeStart < +start && +start < +rangeEnd);
}

