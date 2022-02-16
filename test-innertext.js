
const innertext = require("innertext")
const want = "C:\\Users\\snomi\\OneDrive - Snowstar Lab\\`B\\Godel, Escher, Bach an eternal golden braid by Douglas R. Hofstadter (z-lib.org).epub"
const html = 'C:\\Users\\snomi\\OneDrive - Snowstar Lab\\`B\\Godel, Escher, Bach an eternal golden braid by Douglas R. Hofstadter (<a href="http://z-lib.org">z-lib.org</a>).epub'
const proc = html.replace(/<br.*?>/g, '\n').replace(/\<.*?\>/g, '')
console.assert(want == proc)
console.log(want);
console.log(proc);
console.log(html);

// innertext(html)