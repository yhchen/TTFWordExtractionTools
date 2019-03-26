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
const micromatch = __importStar(require("micromatch"));
const fs_utils = __importStar(require("./fs_utils"));
class MatchFilter {
    constructor() {
        this.includes = new Array(); // include list
        this.excludes = new Array(); // exclude list
        this.includeAll = false; // include all files
    }
}
/**
 * find all match files and return the file list
 * @param filterSList filter list
 * @param dir match dir
 * @param outFileLst out put all the file list
 */
function findMatchFiles(filterSList, dir, outFileLst) {
    const mf = genMatchFilter(filterSList, dir);
    if (!mf) {
        console.error('ERROR : generate file list filter failure!');
        return false;
    }
    fs_utils.foreachFolder(dir, (spath, isDir) => {
        switch (checkPathMatchFilter(path.relative(dir, spath), mf)) {
            case 3 /* exclude */:
                if (isDir)
                    return 2 /* BreakFolder */;
                break;
            case 1 /* match */:
                outFileLst.push(spath);
                break;
            case 2 /* nmatch */: break;
        }
    }, true);
    return true;
}
exports.findMatchFiles = findMatchFiles;
/**
 * generate MatchFilter struct
 * @param filterSList input filters
 * @param searchPath (optional)
 */
function genMatchFilter(filterSList, searchPath) {
    const result = new MatchFilter();
    for (let p of filterSList) {
        let excludeFlag = false;
        if (p && p.length > 1 && p[0] == '!') {
            excludeFlag = true;
            p = p.substr(1);
        }
        if (searchPath) {
            const sPath = path.join(searchPath, p);
            const state = fs.existsSync(sPath) ? fs.statSync(sPath) : undefined;
            if (state && state.isDirectory()) {
                p += '/**/*';
            }
        }
        p = p.replace(/\\/g, '/').replace(/\/\//g, '/');
        if (excludeFlag) {
            result.excludes.push(p);
        }
        else {
            if (p == "**/*") {
                result.includeAll = true;
            }
            result.includes.push(p);
        }
    }
    return result;
}
/**
 * check path match the filter
 * @param spath file path
 * @param filter filter
 */
function checkPathMatchFilter(spath, filter) {
    if (micromatch.any(spath.replace(/\\/g, '/'), filter.excludes)) {
        return 3 /* exclude */;
    }
    if (!filter.includeAll && !micromatch.any(spath, filter.includes)) {
        return 2 /* nmatch */;
    }
    return 1 /* match */;
}
//# sourceMappingURL=match_utils.js.map