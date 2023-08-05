var CryptoJS = require("crypto-js");

export default function gerarHashCode(string) {
    const sha256Hash = CryptoJS.SHA256(string).toString();
    const decimalString = BigInt("0x" + sha256Hash).toString();
    return decimalString;
}