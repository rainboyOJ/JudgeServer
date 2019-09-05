interface any_obj {
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
        spj_src_path?:string
        input?:string
        output?:string
        user_output?:string
        point_num?:string |number
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
        compile_args?:      judge_args
        judge_args?:         judge_args
        spj_compile_args?:   judge_args | null
        spj_judge_args?:    judge_args
        data_list?:  [string,string][]
        judge_data_list?:  [input,output,user_output][]
        result?:        result
    }
}

interface MYREDIS_constructor_params {
    subscribe?: string ,
    publish?: string ,
    compile_queue?: string ,
    judge_queue?: string 
}

interface CONFIG {
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
    LANGUGE_TEMPLATE: {
        [key:string]: {
            compile_args:CTX.judge_args
            spj_compile_args:CTX.judge_args
            judge_args:CTX.judge_args
            spj_judge_args:CTX.judge_args
        }
    }
    REDIS:MYREDIS_constructor_params
}

interface JUDGE_RESULT {
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

interface RESPONSE {
    socket_client_id:string
    result: INTERNAL_SERVER_ERROR | OK | COMPILE_ERROR | SPJ_COMPILE_ERROR // 0 ok 1 compile_error
    message: string
    result_list?:JUDGE_RESULT[]
}

