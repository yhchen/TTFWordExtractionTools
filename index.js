"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const startTick = Date.now();
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const argv = __importStar(require("argv"));
const works_1 = require("./src/works");
const env_1 = require("./src/env");
function printHelp() {
    console.error('Usage :');
    argv.help();
}
// gen version
const pkg = __importStar(require("./package.json"));
argv.version(pkg.version);
const ParamSrcTTF = 'src-ttf';
const ParamOutTTF = 'out-ttf';
const ParamEncoding = 'encoding';
const ParamFilters = 'list-filters';
const ParamFileList = 'file-list';
// gen type
argv.type('encode', function (v) {
    if (env_1.Env.supportEncode.has(v))
        return v;
    throw `ERROR : encoding "${v}" not support.`;
});
// gen args
argv.option([
    {
        name: ParamSrcTTF,
        short: 's',
        type: 'path',
        description: 'Origin ttf file to extra',
        example: '${path_relative_to_cwd}/origin.ttf',
    },
    {
        name: ParamOutTTF,
        short: 'o',
        type: 'path',
        description: 'Output ttf file',
        example: '${path_relative_to_cwd}/out.ttf',
    },
    {
        name: ParamEncoding,
        short: 'e',
        type: 'encode',
        description: 'file encode(ascii|utf8|utf16le|ucs2|latin1)',
        example: 'utf8',
    },
    {
        name: ParamFilters,
        short: 'l',
        type: 'list,string',
        description: 'Input search filters relative to de ${cwd} path. Multi input split with ";". If the path first character is "!" means exclude that path',
        example: 'src/**/*.txt,!test/**/*',
    },
    {
        name: ParamFileList,
        short: 'f',
        type: 'list,string',
        description: 'Input src files. split with ";"',
        example: 'src/**/*.txt,!test/**/*',
    },
]);
function resolvePath(s) {
    if (!s)
        return '';
    if (path.isAbsolute(s))
        return s;
    return path.join(env_1.Env.sRootDir, s);
}
function main() {
    const args = argv.run(process.argv);
    const srcTTF = resolvePath(args.options[ParamSrcTTF]);
    if (!fs.existsSync(srcTTF)) {
        console.error(`ERROR : src ttf file ${srcTTF} not exist!`);
        printHelp();
        return -1;
    }
    const outTTF = resolvePath(args.options[ParamOutTTF]);
    if (!outTTF) {
        console.error(`ERROR : output ttf file must be set!`);
        printHelp();
        return -3;
    }
    if (args.options[ParamEncoding]) {
        env_1.Env.setDefaultEncoding(args.options[ParamEncoding]);
    }
    const filters = new Array();
    const origin_filters = args.options[ParamFilters];
    if (origin_filters) {
        for (const l of origin_filters) {
            const sp = l.trim().split(';');
            for (let s of sp) {
                s = s.trim();
                if (s == '')
                    continue;
                filters.push(s);
            }
        }
    }
    const origin_filelist = args.options[ParamFileList];
    const filelist = new Array();
    for (const l of origin_filelist) {
        const sp = l.trim().split(';');
        for (let s of sp) {
            s = s.trim();
            if (s == '')
                continue;
            filelist.push(s);
        }
    }
    if (filelist.length <= 0 && filters.length <= 0) {
        console.error(`ERROR : one of [list-filters (-l)] or [file-list (-f)] must be set!`);
        printHelp();
        return -2;
    }
    return works_1.execute(srcTTF, outTTF, filters, filelist);
}
// execute main
const ret = main();
if (ret == 0) {
    console.log(`total use time : ${(Date.now() - startTick) / 1000}s`);
}
process.exit(ret);
//# sourceMappingURL=index.js.map