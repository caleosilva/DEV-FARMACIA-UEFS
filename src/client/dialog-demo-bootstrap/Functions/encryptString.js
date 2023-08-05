var CryptoJS = require("crypto-js");

// Importar isso aqui de outro lugar
const keyWord = "farmacia@Solidaria@Ecomp";

export default function encryptString(string) {
    var encrypt = CryptoJS.AES.encrypt(string, keyWord);
    var hashString = encrypt.toString();
    return hashString;
}