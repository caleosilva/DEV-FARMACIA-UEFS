var CryptoJS = require("crypto-js");

const keyWord = "farmacia@Solidaria@Ecomp";

export default function decryptHash(hashCode) {
    var decrypt = CryptoJS.AES.decrypt(hashCode, keyWord);
    var texto = decrypt.toString(CryptoJS.enc.Utf8);
    return texto;
}