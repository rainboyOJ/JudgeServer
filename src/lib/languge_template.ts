import {CONFIG,LANGUGE_TEMPLATE} from '../types/global'

const language_template:LANGUGE_TEMPLATE = {
    'cpp':{
        compile_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/g++",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/output",
            error_path: "{judge_path}/error_path",
            log_path: "{judge_path}/compile_log",
            args: [ "-DONLINE_JUDGE", "-std=c++11", "{src_path}", "-lm", "-o", "{judge_path}/main"]
        },
        judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "{judge_path}/main",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "{input}",
            output_path: "{output}",
            error_path: "{judge_path}/{point_num}/error_out",
            log_path: "{judge_path}/{point_num}/judge_log",
            cwd:"{judge_path}/{point_num}"
        },
        spj_compile_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/g++",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/output",
            error_path: "{judge_path}/error_path",
            log_path: "{judge_path}/compile_log",
            args: [ "-DONLINE_JUDGE", "-std=c++11", "{src_path}", "-lm", "-o", "{judge_path}/main"]
        },
        spj_judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/g++",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/output",
            error_path: "{judge_path}/error_path",
            log_path: "{judge_path}/compile_log",
            args: [ "-DONLINE_JUDGE", "-std=c++11", "{src_path}", "-lm", "-o", "{judge_path}/main"]
        },
    }
}

export default language_template
