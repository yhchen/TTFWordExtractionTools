/**
 * sfntly Tool Download From :
 * https://github.com/rillig/sfntly
 */
import * as path from 'path';
import * as fs from 'fs';
import child_process from 'child_process';

function checkJavaVersion(): number {
    // check java exist!
    try {
        const buff = child_process.execSync('java -version 2>&1', {stdio: 'pipe', encoding: 'buffer', windowsHide: true,});
        const ss = buff.toString().split('\n');
        if (ss.length < 0) {
            console.error('java version incorrect! please install java version 1.8 or greater!');
            return -1002;
        }
        const v = ss[0].split('"');
        if (v.length <= 2) {
            console.error('java version incorrect! please install java version 1.8 or greater!');
            return -1003;
        }
        const sJavaVersion = v[1];
        const verarr = sJavaVersion.split('.');
        if (verarr.length < 3 || parseInt(verarr[0]) < 1 || parseInt(verarr[1]) < 8) {
            console.error(`java version "${sJavaVersion}" incorrect! please install java version 1.8 or greater!`);
            return -1004;
        }
        console.log(`found java version = ${sJavaVersion}`);
    } catch (ex) {
        console.error(`java is need by this tools! please install jre first!`);
        return -1001;
    }
    return 0;
}

/*
java -jar sfnttool.jar
Subset [-?|-h|-help] [-b] [-s string] fontfile outfile
Prototype font subsetter
        -?,-help        print this help information
        -s,-string       String to subset
        -b,-bench        Benchmark (run 10000 iterations)
        -h,-hints        Strip hints
        -w,-woff         Output WOFF format
        -e,-eot  Output EOT format
        -x,-mtx  Enable Microtype Express compression for EOT format
 */
export function executeSfntTool(srcTTF: string, outTTF: string, s: string): number {
    if (!fs.existsSync(srcTTF)) {
        console.error(`source ttf file ${srcTTF} not found!`);
        return -2001;
    }
    const checkRet = checkJavaVersion();
    if (checkRet) {
        return checkRet; // check java version failure
    }
    if (fs.existsSync(outTTF)) {
        console.log('remove old target file');
        fs.unlinkSync(outTTF);
    }
    const tooldir = path.join(path.dirname(process.argv[1]), 'tools', 'sfnttool.jar');
    const cmd = `java -jar ${tooldir} -s "${s}" ${srcTTF} ${outTTF} 2>&1`;
    console.log('Start Gen New TTF file...');
    console.log(`Execute Command :\n${cmd}\n\n`);
    try {
        const buffer = child_process.execSync(cmd, {stdio: 'pipe', encoding: 'buffer', windowsHide: true,});
        console.log(buffer.toString());
    } catch (ex) {
        console.error(ex.toString());
        console.error('Build TTF [Failure]!');
        return -2002;
    }
    if (!fs.existsSync(outTTF)) {
        console.error('Build TTF [Failure]!');
    }
    console.log('Build TTF [SUCCESS]');
    return 0;
}
