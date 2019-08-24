interface any_obj {
    [k :string]:any
}
declare namespace CTX {
    interface post_judge_data { // 发送过来的评测数据的模式
        id: number | string
        lang: string
        code: string
        memory: number      //mb
        time: number        //ms
        stack: number       //mb
        spj: string
        auto_io?:boolean//是否使用 noi 手动读入数据
        file_io?:string  // 如果auto_io 为false 那么这个必须不能为空
    }

    interface config{
        type: "compile" | "judge"
        uuid?:string
        socket_client_id?:string
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
        post_judge_data?:   post_judge_data
        config?:            config
        compile_args?:      judge_args
        spj_compile_arg?:   judge_args
        spj_judge_args?:    judge_args
        judge_args_array?:  judge_args[]
    }
}


interface CONFIG {
    JUDGE_BASE_PATH:string
    DATA_BASE_PATH:string
    TOKEN:string
    LANGUGE_TEMPLATE: {
        [key:string]: {
            compile_args:CTX.judge_args
            spj_compile_args:CTX.judge_args
            judge_args:CTX.judge_args
            spj_judge_args:CTX.judge_args
        }
    }
}