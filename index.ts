const startTick = Date.now();
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
const ParamFileList = 'file-list';

// gen args
argv.option([
    {
        name:       ParamSrcTTF,
        short:      's',
        type:       'path',
        description:'Origin ttf file to extra',
        example:    '${path_relative_to_cwd}/origin.ttf',
    },
    {
        name:       ParamOutTTF,
        short:      'o',
        type:       'path',
        description:'Output ttf file',
        example:    '${path_relative_to_cwd}/out.ttf',
    },
    {
        name:       ParamEncoding,
        short:      'e',
        type:       'string',
        description:'Output ttf file',
        example:    '${path_relative_to_cwd}/out.ttf',
    },
    {
        name:       ParamFilters,
        short:      'l',
        type:       'list,string',
        description:'Input search filters relative to de ${cwd} path. Multi input split with ";". If the path first character is "!" means exclude that path',
        example:    'src/**/*.txt,!test/**/*',
    },
    {
        name:       ParamFileList,
        short:      'f',
        type:       'list,string',
        description:'Input src files. split with ";"',
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
    const filters = new Array<string>();
    const origin_filters: Array<string> = args.options[ParamFilters];
    for (const l of origin_filters) {
        const sp = l.trim().split(';');
        for (let s of sp) {
            s = s.trim();
            if (s == '') continue;
            filters.push(s);
        }
    }

    const origin_filelist: Array<string> = args.options[ParamFileList];
    const filelist = new Array<string>();
    for (const l of origin_filelist) {
        const sp = l.trim().split(';');
        for (let s of sp) {
            s = s.trim();
            if (s == '') continue;
            filelist.push(s);
        }
    }

    if (filelist.length <= 0 && filters.length <= 0) {
        console.error(`ERROR : one of [list-filters (-l)] or [file-list (-f)] must be set!`);
        printHelp();
        return -2;
    }
    return execute(srcTTF, outTTF, filters, filelist);
}
// execute main
const ret = main();
if (ret == 0) {
    console.log(`total use time : ${(Date.now() - startTick) / 1000}s`);
}
process.exit(ret);
