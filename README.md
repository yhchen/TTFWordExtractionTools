# TTFWordExtractionTools

Auto extration part of words from TTF, and make ttf file smaller.

## Usage

```sh

Usage: node index.js [options]

        --help, -h
                Displays help information about this script
                'node index.js -h' or 'node index.js --help'

        --version
                Displays version info
                node index.js --version

        --src-ttf, -s
                Origin ttf file to extra
                ${path_relative_to_cwd}/origin.ttf

        --out-ttf, -o
                Output ttf file
                ${path_relative_to_cwd}/out.ttf

        --encoding, -e
                Output ttf file
                ${path_relative_to_cwd}/out.ttf

        --list-filters, -l
                Input search filters relative to de ${cwd} path. Multi input split with ";". If the path first character is "!" means exclude that path
                src/**/*.txt,!test/**/*

        --file-list, -f
                Input src files. split with ";"
                src/**/*.txt,!test/**/*

```
