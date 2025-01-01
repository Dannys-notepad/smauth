const cryptia = require('cryptia')

const crypt = cryptia()

const encrypted = crypt.encrypt("Hello! Welcome tO cryptia :).");

console.log('[encrypted text]:', encrypted);
console.log('[decrypted text]:', crypt.decrypt(encrypted))
