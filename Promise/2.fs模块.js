// 没有带promise形式
const fs = require('fs');

// 回调函数形式
// fs.readFile('./resource/content.txt',(err,data)=>{
//     if(err) throw err;
//     // 通过toString转换为字符串
//     console.log(data.toString());
// })

// Promise形式
let p = new Promise((resolve,reject)=>{
    fs.readFile('./resource/content.txt',(err,data)=>{
        // 出错进入错误状态
        if(err) reject(err);
        resolve(data);
    })
}).then((result) => {
    console.log(result.toString());
}).catch((err) => {
    console.log(err);
});