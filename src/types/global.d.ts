
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
        spj?: string
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
        input?:string
        output?:string
        point_num?:string |number
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
        args?:string[]
        env?:string[]
        cwd?: string
    }

    interface judge_type_data {
        type:'judge'
        socket_client_id:string
        raw:post_judge_data
        compile_arg: judge_args
        spj_compile_arg:judge_args
        judge_point_arg:judge_args[]
        judge_info: {
            [k:string]:any
        }
    }

    interface ctx {
        method: 'GET'
        path: string
        post_judge_data:    post_judge_data
        config:             config
        compile_args?:      judge_args
        spj_compile_arg?:   judge_args
        spj_judge_args?:    judge_args
        judge_args_array?:  judge_args[]
        data_list?:  [string,string][]
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

interface RESPONSE {
    socket_client_id:string
    result: number      // 0 ok 1 compile_error
    message: string
    result_list?:JUDGE_RESULT[]
}

