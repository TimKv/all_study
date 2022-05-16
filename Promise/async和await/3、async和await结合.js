// 使用async和await实现读取文件
const fs = require('fs');
// 通过util把函数转换为promise对象
const util = require('util');
const ReadFile = util.promisify(fs.readFile)

// 回调函数方式
// fs.readFile('../resource/content.txt',(err,data1)=>{
//     if(err) throw err;
//     fs.readFile('../resource/content2.txt',(err,data2)=>{
//         if(err) throw err;
//         fs.readFile('../resource/content3.txt',(err,data3)=>{
//             if(err) throw err;
//             console.log(data1+data2+data3);
//         })
        
//     })
    
// })


// async和await方式实现
async function main(){
    try {
        let data1 = await ReadFile('../resource/content.txt')
        let data2 = await ReadFile('../resource/content3.txt')
        let data3 = await ReadFile('../resource/content2.txt')
        console.log(data1+data2+data3);
    } catch (error) {
        console.log(error);
    }
}
main()