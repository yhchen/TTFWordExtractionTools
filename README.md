# TTFWordExtractionTools
Auto extration part of words from TTF, and make ttf file smaller.

## Usage
> node index.js [`src ttf file path`] [`output ttf file path`] [`Config file path`]

## config file format

```json

{
    "filters_desc": "filters is a string array. Each string is the include (or exclude start with '!')  relative to the ${cwd} path.",
    "filters": [
        "src/**/*.txt",
        "types/**/*.txt",
        "!src/test/**/*"
    ],
    "encoding_desc": "default value is utf8. this parameter is optional.",
    "encoding": "utf8"
}


```