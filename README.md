# TTFWordExtractionTools

Auto extration part of words from TTF, and make ttf file smaller.

## Usage

```shell

Usage: node index.js [options]

        --help, -h
                Displays help information about this script
                'index.js -h' or 'index.js --help'

        --version
                Displays version info
                index.js --version

        --src-ttf, -s
                origin ttf file to extra
                ${path_relative_to_cwd}/origin.ttf

        --out-ttf, -o
                output ttf file
                ${path_relative_to_cwd}/out.ttf

        --encoding, -e
                output ttf file
                ${path_relative_to_cwd}/out.ttf

        --filters, -f
                the input src files. split with ",". if the path first character is "!" means exclude that path.
                src/**/*.txt,!test/**/*
```
