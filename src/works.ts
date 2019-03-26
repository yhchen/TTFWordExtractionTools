import * as fs from 'fs';
import * as path from 'path';
import StringDecoder from 'string_decoder';

import * as fs_utils from './fs_utils';
import * as match_utils from './match_utils';
import * as sfnt_tools from './sfnttools';
import { Env } from './env';

const SkipCharList = new Set<string>([' ', '"', "'", '\n', '\0']);

export function execute(srcTTFFile: string, outTTFFile: string, pathFilter: string[], filelist: string[]) : number {
    const collection = new Set<string>();
    let s = '';
    let cnts = 0;

    const sFileList = new Array<string>();
    if (pathFilter.length > 0) {
        if (!match_utils.findMatchFiles(pathFilter, Env().sRootDir, sFileList)) {
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
        if (sFileList.indexOf(rs) >= 0) continue; // file already added
        sFileList.push(rs);
    }

    for (const f of sFileList) {
        console.log(`match file : ${f}`);
        const content = fs.readFileSync(f, {encoding:Env().defualtEncoding, flag:'r'});
        for (const c of content) {
            if (SkipCharList.has(c)) continue;
            if (collection.has(c)) continue;
            collection.add(c);
            s = s.concat(c);
            ++cnts;
        }
    }

    console.log(`Total Characters found : ${cnts}`);
    sfnt_tools.executeSfntTool(srcTTFFile, outTTFFile, s);

    return 0;
}
