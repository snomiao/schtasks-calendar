const nodeFetch = require('node-fetch');
const httpsProxyAgent = require('https-proxy-agent');
const sha256 = require('crypto-js/sha256');
const ical = require('ical');
const fs = require('fs');
const { promisify } = require('util');

// Do not use cache and proxy by default.
async function icalObjectFetch(url, cacheTimeout = 0, httpProxy = undefined) {
    const icalRaw = cacheTimeout
        ? await fileCached(`cache-${sha256(url)}.ics`, cacheTimeout,
            async () => await icsFileFetch(url, httpProxy))
        // if cache is disabled then no file will saved.
        : await icsFileFetch(url, httpProxy);
    return ical.parseICS(icalRaw);
}
exports.icalObjectFetch = icalObjectFetch;

async function icsFileFetch(url, httpProxy) {
    // console.debug(`FETCHING ${url}`); 
    return await nodeFetch(url, httpProxy && { agent: new httpsProxyAgent(httpProxy) } )
        .then(res => res.text())
        .catch(e => console.error(`Fetch error on URL: ${url} \nError details: ${e}\n\n Maybe you should check your network or you need a proxy to connect to google. `));
}

async function fileCached(filename, timeout, request) {
    const stat = await promisify(fs.exists)(filename) && await fs.promises.stat(filename);
    const mtime = stat?.mtime; // modify time or undefined
    const isCacheValid = stat && +mtime + timeout > +new Date(); // 1h cache
    if (isCacheValid) {
        return await fs.promises.readFile(filename, 'utf-8');
    }
    else {
        console.debug(`cache is expired and it's refreshing... : ${new Date().toISOString()} - ${filename}`);
        const raw = await request();
        await fs.promises.writeFile(filename, raw);
        return raw;
    }
}

// test
if (!module.parent) (async () => {
    const icsObj = await icalObjectFetch("https://www.officeholidays.com/ics/china")
    console.info(icsObj);
})()
