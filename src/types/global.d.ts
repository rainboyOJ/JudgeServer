interface any_obj {
    [k :string]:any
}
declare namespace JudgeServer {
    interface postJudgeData { // 发送过来的评测数据的模式
        id: number | string,
            lang: string,
            code: string,
            memory: number,     //
            time: number,
            stack: number,
            spj: string,
            auto_io?:boolean,//是否使用 noi 手动读入数据
            file_io?:string  // 如果auto_io 为false ,那么这个必须不能为空
    }

    interface compile_type_data {
        type:'compile',
            socket_client_id:string,
            raw:postJudgeData
    }

    interface judge_argument { //评测的数据参数类型
        max_cpu_time?:number,
            max_real_time?:number,
            max_memory?:number,
            memory_limit_check_only?:number,
            max_stack?:number,
            max_process?:number,
            max_output_size?:number,
            exe_path?:string,
            input_path?:string,
            output_path?:string,
            error_path?:string,
            args?:string[],
            env?:string[],
            cwd?: string
    }

    interface judge_type_data {
        type:'judge',
            socket_client_id:string,
            raw:postJudgeData,
            compile_arg: judge_argument,
            spj_compile_arg:judge_argument,
            judge_point_arg:judge_argument[],
            judge_info: {
                [k:string]:any
            }
    }
}

