// 读取文件
function myReadFile(path){
    return new Promise((resolve,reject)=>{
        require('fs').readFile(path,(err,data)=>{
            if(err) reject(err);
            resolve(data)
        })
    }).then((result)=>{
        console.log(result.toString());
    },(err)=>{
        console.warn(err);
    })
}

myReadFile('./resource/content.txt')