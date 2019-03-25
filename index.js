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
// gen args
argv.option([
    {
        name: ParamSrcTTF,
        short: 's',
        type: 'path',
        description: 'origin ttf file to extra',
        example: '${path_relative_to_cwd}/origin.ttf',
    },
    {
        name: ParamOutTTF,
        short: 'o',
        type: 'path',
        description: 'output ttf file',
        example: '${path_relative_to_cwd}/out.ttf',
    },
    {
        name: ParamEncoding,
        short: 'e',
        type: 'string',
        description: 'output ttf file',
        example: '${path_relative_to_cwd}/out.ttf',
    },
    {
        name: ParamFilters,
        short: 'l',
        type: 'string',
        description: 'the input src files. split with ",". if the path first character is "!" means exclude that path.',
        example: 'src/**/*.txt,!test/**/*',
    },
]);
function resolvePath(s) {
    if (path.isAbsolute(s))
        return s;
    return path.join(env_1.Env().sRootDir, s);
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
        env_1.setDefaultEncode(args.options[ParamEncoding]);
    }
    if (!args.options[ParamFilters]) {
        console.error(`ERROR : list-filters (-l) must be set!`);
        printHelp();
        return -2;
    }
    const origin_filters = args.options[ParamFilters].split(',');
    const filters = new Array();
    for (const s of origin_filters) {
        if (s.trim() == '')
            continue;
        filters.push(s);
    }
    return works_1.execute(filters, srcTTF, outTTF);
}
// execute main
process.exit(main());
//# sourceMappingURL=index.js.map