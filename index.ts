import * as fs from 'fs';
import * as path from 'path';
import {execute} from './src/works';
import {Env, setDefaultEncode} from './src/env';

function printHelp() {
    console.error("Usage :");
    console.error(`${process.argv[0]} ${process.argv[1]} [src ttf file path] [output ttf file path] [Config file path]`);
}

let srcTTF: string;
let outTTF: string;
let configs: {filters:string[], encoding: string};

function resolvePath(s: string): string {
    if (path.isAbsolute(s)) return s;
    return path.join(Env().sRootDir, s);
}

function parseArgs(): boolean {
    if (process.argv.length < 5) {
        console.error('ERROR : parameters error.');
        printHelp();
        return false;
    }
    srcTTF = resolvePath(process.argv[2]);
    if (!fs.existsSync(srcTTF)) {
        console.error(`ERROR : src ttf file ${srcTTF} not exist!`);
        printHelp();
        return false;
    }

    outTTF = resolvePath(process.argv[3]);
    const configFile = resolvePath(process.argv[4]);
    if (!fs.existsSync(configFile)) {
        console.error(`ERROR : config file ${configFile} not exist!`);
        printHelp();
        return false;
    }
    const configFileData = fs.readFileSync(configFile, { encoding: Env().defualtEncoding, flag: 'r' });
    try {
        configs = JSON.parse(configFileData);
        if (configs == null) throw 'config file format error.';
        if (configs.filters == null) throw 'config file is empty';
        if (configs.encoding) { setDefaultEncode(configs.encoding); }
        if (!(configs.filters instanceof Array)) throw 'config file format incorrect';
    } catch (ex) {
        console.error(`ERROR config file ${configFile} format error`);
        console.error(ex.toString());
        return false;
    }

    return true;
}

function main(): number {
    if (!parseArgs()) {
        return -1;
    }
    return execute(configs.filters, srcTTF, outTTF);
}
// execute main
process.exit(main());
