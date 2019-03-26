// The character encodings currently supported by Node.js include:
// 'ascii' - For 7-bit ASCII data only. This encoding is fast and will strip the high bit if set.
// 'utf8' - Multibyte encoded Unicode characters. Many web pages and other document formats use UTF-8.
// 'utf16le' - 2 or 4 bytes, little-endian encoded Unicode characters. Surrogate pairs (U+10000 to U+10FFFF) are supported.
// 'ucs2' - Alias of 'utf16le'.
// 'base64' - Base64 encoding. When creating a Buffer from a string, this encoding will also correctly accept "URL and Filename Safe Alphabet" as specified in RFC4648, Section 5.
// 'latin1' - A way of encoding the Buffer into a one-byte encoded string (as defined by the IANA in RFC1345, page 63, to be the Latin-1 supplement block and C0/C1 control codes).
// 'binary' - Alias for 'latin1'.
// 'hex' - Encode each byte as two hexadecimal characters.

const gEnv = {
    sRootDir : process.cwd(), // work root dir
    defualtEncoding : 'utf8', // default encoding
}

/**
 * set default file encoding
 * @param encode default encode
 */
export function setDefaultEncode(encode: string): void {
    gEnv.defualtEncoding = encode;
}


/**
 * make Type readonly recursive
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
}

/**
 * global env values
 */
export const Env = <DeepReadonly<typeof gEnv>>(gEnv);
