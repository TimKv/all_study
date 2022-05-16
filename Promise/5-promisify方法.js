// promise化
const util = require('util');
const fs = require('fs')
//   通过promisify方法可以更方便的将回调函数风格的方法转变为promise风格的方法
let mineReadFile = util.promisify(fs.readFile);
mineReadFile('./resource/content.txt').then(value=>{
    console.log(value.toString());
})