import * as fs from 'fs';
import * as path from 'path';
import * as argv from 'argv';
import {execute} from './src/works';
import {Env, setDefaultEncode} from './src/env';

function printHelp() {
    console.error('Usage :');
    argv.help();
}

// gen version
import * as pkg from './package.json';
argv.version(pkg.version);

const ParamSrcTTF = 'src-ttf';
const ParamOutTTF = 'out-ttf';
const ParamEncoding = 'encoding';
const ParamFilters = 'list-filters';

// gen args
argv.option([
    {
        name:       ParamSrcTTF,
        short:      's',
        type:       'path',
        description:'origin ttf file to extra',
        example:    '${path_relative_to_cwd}/origin.ttf',
    },
    {
        name:       ParamOutTTF,
        short:      'o',
        type:       'path',
        description:'output ttf file',
        example:    '${path_relative_to_cwd}/out.ttf',
    },
    {
        name:       ParamEncoding,
        short:      'e',
        type:       'string',
        description:'output ttf file',
        example:    '${path_relative_to_cwd}/out.ttf',
    },
    {
        name:       ParamFilters,
        short:      'l',
        type:       'string',
        description:'the input src files. split with ",". if the path first character is "!" means exclude that path.',
        example:    'src/**/*.txt,!test/**/*',
    },
]);

function resolvePath(s: string): string {
    if (path.isAbsolute(s)) return s;
    return path.join(Env().sRootDir, s);
}

function main(): number {
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
        setDefaultEncode(args.options[ParamEncoding]);
    }
    if (!args.options[ParamFilters]) {
        console.error(`ERROR : list-filters (-l) must be set!`);
        printHelp();
        return -2;
    }
    const origin_filters: Array<string> = args.options[ParamFilters].split(',');
    const filters = new Array<string>();
    for (const s of origin_filters) {
        if (s.trim() == '') continue;
        filters.push(s);
    }
    return execute(filters, srcTTF, outTTF);
}
// execute main
process.exit(main());
