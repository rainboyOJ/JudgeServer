import {type} from "os";
import {outputFile, PathLike} from "fs-extra";

export interface any_obj {
    [k :string]:any
}
declare namespace CTX {
    interface post_judge_data { // 发送过来的评测数据的模式
        id: number | string
        lang: string
        code: string
        memory?: number      //mb
        time?: number        //ms
        stack?: number       //mb
        spj?: string | 'INNER' //inner 表示使用数据目录内部的spj
        auto_io?:boolean//是否使用 noi 手动读入数据
        file_in?:string  // 如果auto_io 为false 那么这个必须不能为空
        file_out?:string  // 如果auto_io 为false 那么这个必须不能为空
    }

    interface config{
        type: "compile" | "judge"
        socket_client_id:string
        uuid?:string
        judge_path?:string
        base_path?:string
        data_path?:string
        src_path?:string
        spj_ext?:string     // spj 的后缀 
        spj_path?:string    // spj 的路径
        spj_src_path?:string
        input?:string       //-> 根据 file_in 来
        output?:string      //-> 根据 实际 来
        user_output?:string //-> 根据 file_out 来
        point_num?:string |number
    }

    interface DATA {
        raw_list: any[] //数据目录下的所有文件

        //分类好的测试数据
        //一维数组,idx 第几个测试点,编号从0开始
        list:{
            raw_input:PathLike,     //原始的输入数据路径
            raw_output:PathLike,    //原始的输出数据路径
            input:PathLike,         //输入数据路径
            user_output:PathLike,   //用户输出的路径
            idx:string|number
        }[]  
        //list_for_auto_io:({input:PathLike,output:PathLike,user_output:PathLike,idx:string}[])[] 
        //dataYML: {
            //subtasks: {score:number,type: 'sum' | 'mul' | 'min',case:(number |string)[]}[]
            //inputFile:string
            //outputFile:string
            //specialJudge?:{ language:string,fileName:string}
            //extraSourceFiles?:{language:string,files:{name:string,dest:string}[]}[]
        //}
        /*  [
         *      [ {input,output,user_output,idx:"0.0"},
         *        {input,output,user_output,idx:"0.1"}
         *      ], // subtask1
         *      [ [input,output,user_output],... ],  // subtask2
         *      ...
         *  ]
         */
    }

    interface result {
        cpu_time: number
        real_time: number
        memory: number
        signal: number
        exit_code: number
        error: number
        result: number
    }

    interface save_result {
        point_num:number
        result:result
    }

    interface judge_args { //评测的数据参数类型
        max_cpu_time?:number
        max_real_time?:number
        max_memory?:number
        memory_limit_check_only?:number
        max_stack?:number
        max_process?:number
        max_output_size?:number
        exe_path?:string
        input_path?:string
        output_path?:string
        seccomp_rule_name?:string
        error_path?:string
        log_path?:string
        args?:string[]
        env?:string[]
        cwd?: string
        gid?: number,
        uid?: number,
    }


    type input = string         //输入
    type output = string        //输出
    type user_output = string   //用户输出

    interface ctx {
        method: 'GET'
        path: string
        post_judge_data:    post_judge_data
        config:             config
        data:               DATA
        compile_args?:      judge_args
        judge_args?:         judge_args
        spj_compile_args?:   judge_args | null
        spj_judge_args?:    judge_args
        data_list?:  [string,string][]
        judge_data_list?:  [input,output,user_output][]
        result?:        result
    }
}

export interface MYREDIS_constructor_params {
    subscribe?: string ,
    publish?: string ,
    compile_queue?: string ,
    judge_queue?: string 
}

export interface LANGUGE_TEMPLATE {
    [key:string]: {
        compile_args:CTX.judge_args
        spj_compile_args:CTX.judge_args
        judge_args:CTX.judge_args
        spj_judge_args:CTX.judge_args
    }
}

export interface CONFIG {
    JUDGE_BASE_PATH:string
    DATA_BASE_PATH:string
    TOKEN:string
    DEFAULT_POST_JUDGE_ARGS: {
        id: string
        lang: string
        memory: number
        time: number
        stack: number
        spj: string
        auto_io: boolean
    }
    DEFAULT_SPJ: string
    JUDGE_EXTRA_MEMORY: number
    REDIS:MYREDIS_constructor_params
}


export interface JUDGE_RESULT {
    cpu_time: number
    real_time: number
    memory: number
    signal: number
    exit_code: number
    result: number
    error: number
}

type INTERNAL_SERVER_ERROR= -1
type OK = 0
type COMPILE_ERROR = 1
type SPJ_COMPILE_ERROR = 2

export interface RESPONSE {
    socket_client_id:string
    result: INTERNAL_SERVER_ERROR | OK | COMPILE_ERROR | SPJ_COMPILE_ERROR // 0 ok 1 compile_error
    message: string
    result_list?:JUDGE_RESULT[]
}

