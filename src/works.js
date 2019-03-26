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
const match_utils = __importStar(require("./match_utils"));
const sfnt_tools = __importStar(require("./sfnttools"));
const env_1 = require("./env");
const SkipCharList = new Set(['\n', '\0', '\r', '"']);
const ConvertCharList = new Map([['^', '^^'], ['<', '^<'], ['>', '^>'], ['|', '^|'], ['&', '^&'], ['"', '""'], ['%', '%%']]);
function execute(srcTTFFile, outTTFFile, pathFilter, filelist) {
    const collection = new Set();
    let s = '';
    let cnts = 0;
    const sFileList = new Array();
    if (pathFilter.length > 0) {
        if (!match_utils.findMatchFiles(pathFilter, env_1.Env().sRootDir, sFileList)) {
            console.error(`ERROR : find match files failure!`);
            return -4002;
        }
    }
    for (const s of filelist) {
        const rs = path.resolve(s);
        if (!fs.existsSync(rs)) {
            console.error(`ERROR : file "${rs}" not found!`);
            return -4001;
        }
        if (sFileList.indexOf(rs) >= 0)
            continue; // file already added
        sFileList.push(rs);
    }
    for (const f of sFileList) {
        console.log(`match file : ${f}`);
        const content = fs.readFileSync(f, { encoding: env_1.Env().defualtEncoding, flag: 'r' });
        for (let c of content) {
            c = ConvertCharList.get(c) || c;
            if (SkipCharList.has(c))
                continue;
            if (collection.has(c))
                continue;
            collection.add(c);
            s = s.concat(c);
            ++cnts;
        }
    }
    console.log(`Total Characters found : ${cnts}`);
    sfnt_tools.executeSfntTool(srcTTFFile, outTTFFile, s);
    return 0;
}
exports.execute = execute;
//# sourceMappingURL=works.js.map