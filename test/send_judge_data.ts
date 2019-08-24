/// <reference path="../src/types/global.d.ts" />
import * as Client from 'socket.io-client'
import {readFileSync} from 'fs'

const client = Client("http://127.0.0.1:5000?token=token")

client.on('connect',()=>{
    console.log('connected!')
})

var post_data = {
    code: readFileSync(__dirname+'/a+b.cpp',{encoding:"utf-8"}),
    id: "a+b",
    lang: "cpp",
    memory: 128, //mb
    time: 1000 ,  //ms
    stack: 128, //mb
    spj: "default",
    auto_io:true,//是否使用 noi 手动读入数据
    file_io:"a+b"// 如果auto_io 为false 那么这个必须不能为空
}


client.emit("judge",post_data)