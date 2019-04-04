import * as fs from 'fs';
import * as path from 'path';
import * as micromatch from 'micromatch';
import * as fs_utils from './fs_utils'

class MatchFilter {
    public includes = new Array<string>(); // include list
    public excludes = new Array<string>(); // exclude list
    public includeAll = false; // include all files
}


/**
 * find all match files and return the file list
 * @param filterSList filter list
 * @param dir match dir
 * @param outFileLst out put all the file list
 */
export function findMatchFiles(filterSList: string[], dir: string, outFileLst: Array<string>): boolean {
    const mf = genMatchFilter(filterSList, dir);
    if (!mf) {
        console.error('ERROR : generate file list filter failure!');
        return false;
    }
    fs_utils.foreachFolder(dir, (spath, isDir) => {
        switch (checkPathMatchFilter(path.relative(dir, spath), mf)) {
            case EMathType.exclude:     if (isDir) return fs_utils.EFFolderBreakType.BreakFolder; break;
            case EMathType.match:       if (!isDir) outFileLst.push(spath); break;
            case EMathType.nmatch:      break;
        }
        return;
    }, true);
    return true;
}

function customIsAbsolutePath(s: string): boolean {
    return s.length >= 2 && (s[0] == '/' || s[1] == ':');
}


/**
 * generate MatchFilter struct
 * @param filterSList input filters
 * @param searchPath (optional)
 */
function genMatchFilter(filterSList: string[], searchPath?: string): MatchFilter {
    const result:MatchFilter = new MatchFilter();
    for (let p of filterSList) {
        let excludeFlag = false;
        if (p && p.length > 1 && p[0] == '!') {
            excludeFlag = true;
            p = p.substr(1);
        }
        if (searchPath) {
            const sPath = customIsAbsolutePath(p) ? p : path.join(searchPath, p);
            const state = fs.existsSync(sPath) ? fs.statSync(sPath) : undefined;
            if (state && state.isDirectory()) {
                p += '/**/*';
            }
        }
        p = p.replace(/\\/g, '/').replace(/\/\//g, '/');
        if (excludeFlag) {
            result.excludes.push(p);
        } else {
            if (p == "**/*") {
                result.includeAll = true;
            }
            result.includes.push(p);
        }
    }

    return result;
}

const enum EMathType {
    match = 1, // match
    nmatch = 2, // not match
    exclude = 3, // exclude from search list
}

/**
 * check path match the filter
 * @param spath file path
 * @param filter filter
 */
function checkPathMatchFilter(spath: string, filter: MatchFilter): EMathType {
    if (micromatch.any(spath.replace(/\\/g, '/'), filter.excludes)) {
        return EMathType.exclude;
    }
    if (!filter.includeAll && !micromatch.any(spath, filter.includes)) {
        return EMathType.nmatch;
    }
    return EMathType.match;
}