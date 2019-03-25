"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const works_1 = require("./src/works");
const env_1 = require("./src/env");
function printHelp() {
    console.error("Usage :");
    console.error(`${process.argv[0]} ${process.argv[1]} [src ttf file path] [output ttf file path] [Config file path]`);
}
let srcTTF;
let outTTF;
let configs;
function resolvePath(s) {
    if (path.isAbsolute(s))
        return s;
    return path.join(env_1.Env().sRootDir, s);
}
function parseArgs() {
    if (process.argv.length < 5) {
        console.error('ERROR : parameters error.');
        printHelp();
        return false;
    }
    srcTTF = resolvePath(process.argv[2]);
    if (!fs.existsSync(srcTTF)) {
        console.error(`ERROR : src ttf file ${srcTTF} not exist!`);
        printHelp();
        return false;
    }
    outTTF = resolvePath(process.argv[3]);
    const configFile = resolvePath(process.argv[4]);
    if (!fs.existsSync(configFile)) {
        console.error(`ERROR : config file ${configFile} not exist!`);
        printHelp();
        return false;
    }
    const configFileData = fs.readFileSync(configFile, { encoding: env_1.Env().defualtEncoding, flag: 'r' });
    try {
        configs = JSON.parse(configFileData);
        if (configs == null)
            throw 'config file format error.';
        if (configs.filters == null)
            throw 'config file is empty';
        if (configs.encoding) {
            env_1.setDefaultEncode(configs.encoding);
        }
        if (!(configs.filters instanceof Array))
            throw 'config file format incorrect';
    }
    catch (ex) {
        console.error(`ERROR config file ${configFile} format error`);
        console.error(ex.toString());
        return false;
    }
    return true;
}
function main() {
    if (!parseArgs()) {
        return -1;
    }
    return works_1.execute(configs.filters, srcTTF, outTTF);
}
// execute main
process.exit(main());
//# sourceMappingURL=index.js.map