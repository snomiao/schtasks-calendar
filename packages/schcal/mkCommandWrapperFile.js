const fs = require('fs');
const { env } = require('process');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const sha256 = require('crypto-js/sha256');
async function mkCommandWrapperFile(wraperName, commands) {
    const wrapperFolder = path.join(env.USERPROFILE, `/.schcal/wrapper`);
    await fs.promises.mkdir(wrapperFolder, { recursive: true });
    const wrapperPath = path.join(wrapperFolder, `/` + sha256(commands) + ".vbs");
    await fs.promises.access(commands).then(() => commands = `"${commands}"`).catch(() => undefined);
    const wrapperContent = `WScript.CreateObject("WScript.Shell").run("${commands.replace(/"/g, '""')}")`;
    await fs.promises.writeFile(wrapperPath, wrapperContent, "utf16le");
    return wrapperPath;
}
exports.mkCommandWrapperFile = mkCommandWrapperFile;

// test
if (!module.parent) (async () => {
    // const long_url = "https://dreampuf.github.io/GraphvizOnline/#digraph%20G%20%7B%0A%0A%20%20subgraph%20cluster_0%20%7B%0A%20%20%20%20style%3Dfilled%3B%0A%20%20%20%20color%3Dlightgrey%3B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dwhite%5D%3B%0A%20%20%20%20a0%20-%3E%20a1%20-%3E%20a2%20-%3E%20a3%3B%0A%20%20%20%20label%20%3D%20%22process%20%231%22%3B%0A%20%20%7D%0A%0A%20%20subgraph%20cluster_1%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%5D%3B%0A%20%20%20%20b0%20-%3E%20b1%20-%3E%20b2%20-%3E%20b3%3B%0A%20%20%20%20label%20%3D%20%22process%20%232%22%3B%0A%20%20%20%20color%3Dblue%0A%20%20%7D%0A%20%20start%20-%3E%20a0%3B%0A%20%20start%20-%3E%20b0%3B%0A%20%20a1%20-%3E%20b3%3B%0A%20%20b2%20-%3E%20a3%3B%0A%20%20a3%20-%3E%20a0%3B%0A%20%20a3%20-%3E%20end%3B%0A%20%20b3%20-%3E%20end%3B%0A%0A%20%20start%20%5Bshape%3DMdiamond%5D%3B%0A%20%20end%20%5Bshape%3DMsquare%5D%3B%0A%7D"
    // await testWrapper(long_url);

    // const commands = `cmd /C echo running notepad and wait close  && "C:\\Windows\\notepad.exe" "C:\\Windows\\notepad.exe" && echo done && pause`
    // await testWrapper(commands);

    // const commands = "C:\\Users\\snomi\\OneDrive\\`SERVICE\\go-to-sleep\\1630今日回顾.ahk"
    const commands = "C:\\Users\\snomi\\OneDrive\\`SERVICE\\go-to-sleep\\1630今日回顾.ahk"
    // const commands = "D:\\Users\\snomi\\CapslockX\\Tools\\工具-复制随机强密码.ahk"
    await testWrapper(commands);
})()

async function testWrapper(command) {
    const path = await mkCommandWrapperFile("tmp", command);
    console.log(path)
    console.log(await fs.promises.readFile(path))
    await promisify(exec)(path);
    // await fs.promises.unlink(path);
}

