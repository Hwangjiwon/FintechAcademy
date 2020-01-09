var ceasar = require('./ceasarChiper');
var md5 = require('md5');
console.log(ceasar.encrypt(9, 'Rhi how are you i am fine'));
console.log(ceasar.decrypt(3, 'Qrghmv'));
console.log(md5('A가 B 에게 10만원을 전송함'));