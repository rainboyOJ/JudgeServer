/// <reference path="../src/types/global.d.ts" />
import * as Client from 'socket.io-client'
import {readFileSync} from 'fs'

const client = Client("http://127.0.0.1:5000?token=token")

client.on('connect',()=>{
    console.log('connected!')
})

var code = readFileSync(__dirname+'/a+b.cpp',{encoding:"utf-8"})
console.log(code)
var post_data = {
    code,
    id: "a+b",
    lang: "cpp",
    memory: 128, //mb
    time: 1000 ,  //ms
    stack: 128, //mb
    spj: "default",
    auto_io:false,//是否使用 noi 手动读入数据
    file_in:"in",
    file_out:"out"
}
console.log(post_data.code)


client.emit("judge",post_data)

client.on("judge_response",function(data:any){
    console.log(data)
})
