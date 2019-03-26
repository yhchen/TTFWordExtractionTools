import * as fs from 'fs';
import * as path from 'path';

/**
 * create directory recursive
 * @param dir file or directory
 */
export function mkdir(dir: string): boolean {
    // fs.mkdirSync(dir, {recursive:true});

    if (!fs.existsSync(dir)) {
        const parentDir = path.dirname(dir);
        if (!fs.existsSync(parentDir)) {
            mkdir(parentDir);
        }
        fs.mkdirSync(dir);
    }

    return fs.existsSync(dir);
}

const GlobalIgnoreFolderLst = new Set<string>(['.svn', '.git']);

/**
 * 
 * @param s add global ignore file or directory in ignore filter
 */
export function AddGlobalIgnoreFileOrDir(s: string) : void {
    GlobalIgnoreFolderLst.add(s);
}

export const enum EFFolderBreakType {
    None,
    BreakAll,
    BreakFolder,
}

/**
 * iterator ${dir} recursive or  in dfs mode.
 * @param dir directory to be iterator
 * @param callback 
 * @param recursive 
 */
export function foreachFolder(dir: string, callback: (path: string, isDir: boolean)=>EFFolderBreakType|void, recursive: boolean = true): boolean {
    let plst = fs.readdirSync(dir);
    for (let p of plst) {
        let spath = path.join(dir, p);
        let isDir = fs.statSync(spath).isDirectory();
        // skip global ignore files(or extension)
        if (GlobalIgnoreFolderLst.has(path.basename(spath))) {
            continue;
        }
        let ret = callback(spath, isDir);
        if (ret == EFFolderBreakType.BreakAll) {
            return false;
        } else if (ret == EFFolderBreakType.BreakFolder) {
            continue;
        }
        if (isDir && recursive) {
            if (!foreachFolder(spath, callback)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * get file full extension
 * example : 
 *     /1.pvr.ccz => .pvr.ccz
 *     /path/34kjdfdfjdf.txt.zip => .txt.zip
 *     /my_path/file_no_ext => `[empty string]`
 * @param filename file path
 * @param includeDot include `.` default is `true`
 */ 
export function getFileExtName(filename: string, includeDot: boolean = true): string {
    let lastIdx = filename.length;
    for (let i = lastIdx - 1; i >- 1; --i) {
        const c = filename[i];
        if (c == '/' || c == '\\') {
            break;
        } else if (c == '.') {
            lastIdx = i + 1;
        }
    }
    if (lastIdx == filename.length) return ''; // not found...
    return filename.substr(includeDot ? lastIdx - 1 : lastIdx);
}

/**
 * copy file sync
 * @param src 
 * @param dest 
 */
export function copyFile(src: string, dest: string): boolean {
    if (!fs.existsSync(dest)) {
        if (path.basename(src) == path.basename(dest)) {
            mkdir(path.dirname(dest));
        } else {
            mkdir(dest);
        }
    }
    try {
        fs.copyFileSync(src, dest);
    } catch (err) {
        console.error('ERROR : copy file [' + src + '] to path [' + dest + '] failure!!!');
        console.error(JSON.stringify(err));
        return false;
    }
    return true;
}


/**
 * copy directory recursive (sync)
 * @param src 
 * @param dest 
 * @param extFilter 
 */
export function copyDir(src: string, dest: string, extFilter?: Set<string>): boolean {
    if (extFilter && (extFilter.has('*') || extFilter.has('.*'))) {
        extFilter = undefined;
    }
    foreachFolder(src, (srcpath: string, isDir: boolean) => {
        const destpath = path.join(dest, path.relative(src, srcpath));
        if (isDir) {
            mkdir(destpath);
        } else {
            if (!extFilter || extFilter.has(getFileExtName(srcpath))) {
                copyFile(srcpath, destpath);
            }
        }
    });
    return true;
}

/**
 * copy file or directory recursive (sync)
 * @param src 
 * @param dest 
 * @param extFilter 
 */
export function copy(src: string, dest: string, extFilter?: Set<string>): boolean {
    if (!fs.existsSync(src)) return false;
    const fstate = fs.statSync(src);
    if (!fstate) return false;
    if (fstate.isFile()) {
        return copyFile(src, dest);
    } else {
        return copyDir(src, dest, extFilter);
    }
}

/**
 * remove file or directory recursive
 * @param dir 
 */
export function rm(dir: string): boolean {
    if(fs.existsSync(dir)) {
        if (fs.statSync(dir).isFile()) {
            fs.unlinkSync(dir);
        } else {
            const files = fs.readdirSync(dir);
            files.forEach(function(file){
                let curPath = path.join(dir, file);
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    rm(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    }

    return !fs.existsSync(dir);
}
