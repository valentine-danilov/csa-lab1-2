const CryptoJS = require("crypto-js");

export function encryptAES_CBC(key, source) {

    let keyBytes = new TextEncoder("utf-8").encode(key);
    console.log(keyBytes)
    let iv = CryptoJS.lib.WordArray.random(192/8);
    let sourceBytes = new TextEncoder("utf-8").encode(source);




}