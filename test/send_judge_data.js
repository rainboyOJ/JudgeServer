const Client  = require("socket.io-client")
const assert = require('assert');
const {readFileSync } = require("fs")

const client = Client("http://127.0.0.1:5000?token=token")

client.on('connect',()=>{
    console.log('connected!')
})

////console.log(code)
//var post_data = {
    //code,
    //id: "a+b",
    //lang: "cpp",
    //memory: 128, //mb
    //time: 1000 ,  //ms
    //stack: 128, //mb
    //spj: "default",
    //auto_io:true,//是否使用 noi 手动读入数据
    //file_in:"in",
    //file_out:"out"
//}
//console.log(post_data.code)


//client.emit("judge",post_data)

var test_list = [
    {
        name:"a+b cpp auto_io_true",
        code_path:"a+b.cpp",
        judge_args:{
            code:"",
            uid:"a+b cpp auto_io_true",
            id: "a+b",
            lang: "cpp",
            memory: 128, //mb
            time: 1000 ,  //ms
            stack: 128, //mb
            spj: "default",
            auto_io:true,//是否使用 noi 手动读入数据
            file_in:"in",
            file_out:"out"
        },
        assert:function({result_list}){
          let sum = 0
          for(let {result} of result_list) sum+=result
          assert.equal(sum, 0)
        }
    },
    {
        name:"a+b cpp auto_io_false",
        code_path:"a+b_freopen.cpp",
        judge_args:{
            code:"",
            uid:"a+b cpp auto_io_false",
            id: "a+b",
            lang: "cpp",
            memory: 128, //mb
            time: 1000 ,  //ms
            stack: 128, //mb
            spj: "default",
            auto_io:false,//是否使用 noi 手动读入数据
            file_in:"in",
            file_out:"out"
        },
        assert:function({result_list}){
          let sum = 0
          for(let {result} of result_list) sum+=result
          assert.equal(sum, 0)
        }
    },
    {
        name:"a+b python3 auto_io_false 指定spj.py",
        code_path:"a+b_freopen.cpp",
        judge_args:{
            uid:"a+b cpp auto_io_false 指定spj.py",
            code:"",
            id: "a+b",
            lang: "cpp",
            memory: 128, //mb
            time: 1000 ,  //ms
            stack: 128, //mb
            spj: "spj.py",
            auto_io:false,//是否使用 noi 手动读入数据
            file_in:"in",
            file_out:"out"
        },
        assert:function({result_list}){
          let sum = 0
          for(let {result} of result_list) sum+=result
          assert.equal(sum, 0)
        }
    },
    {
        name:"a+b python3 auto_io_true 指定spj.py",
        code_path:"a+b.py",
        judge_args:{
            code:"",
          uid:"a+b py3 auto_io_true 指定spj.py",
            id: "a+b",
            lang: "py",
            memory: 128, //mb
            time: 1000 ,  //ms
            stack: 128, //mb
            spj: "default",
            auto_io:true,//是否使用 noi 手动读入数据
            file_in:"in",
            file_out:"out"
        },
        assert:function({result_list}){
          let sum = 0
          for(let {result} of result_list) sum+=result
          assert.equal(sum, 0)
        }
    }
]

function print_result(judge_result){
  for (let i = 0 ;i<judge_result.length;i++){
    let {result,memory,cpu_time,real_time,signal,error,exit_code}  =  judge_result[i]
    console.log(`${ i}: result: ${result}   memory: ${memory}    cpu_time: ${cpu_time}    real_time: ${real_time}    signal: ${signal}    error: ${error}    exit_code: ${exit_code} `)
  }
}


function Test(test_case){
    return new Promise( (res,rej)=>{
        client.emit("judge",test_case)
        client.on("judge_response",function(data){
            res(data)
        })

    })
}

async function do_test(){
    for( let test_case of test_list){
        console.log(`============[ ${test_case.name} ]============`)
        test_case.judge_args.code = readFileSync(test_case.code_path,{encoding:"utf-8"})
        let judge_result  = await Test(test_case.judge_args)
        if( judge_result.result !=0 ){
          console.log(judge_result)
          throw(judge_result)
        }
        console.log(judge_result.uid)
        print_result(judge_result.result_list)
        test_case.assert(judge_result)
        console.log("测试通过")
    }
}
do_test()
