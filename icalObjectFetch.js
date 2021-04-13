/**
 * Fetch iCal Object from *.ics URL
 * Author: snomiao (snomiao@gmail.com)
 * 2020-2021
 */
const fetch = require('node-fetch-with-proxy');
const ical = require('ical');

async function icalObjectFetch(url) {
    const ics = await fetch(url)
        .then(res => res.text())
        .catch(e => console.error(`Fetch error on URL: ${url} \nError details: ${e}\n\n Maybe you should check your network or you need a proxy to connect to google. `))
    return ics && ical.parseICS(ics);
}
exports.icalObjectFetch = icalObjectFetch;

// test
if (!module.parent) (async () => {
    const icsObj = await icalObjectFetch("https://www.officeholidays.com/ics/china")
    console.info(icsObj);
})()
