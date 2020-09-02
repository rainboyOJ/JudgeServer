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
            output_path: "{judge_path}/compile_output",
            error_path: "{judge_path}/compile_error",
            log_path: "{judge_path}/compile_log",
            env:["PATH=/usr/bin"],
            args: [ "-DONLINE_JUDGE", "-std=c++11", "{src_path}", "-lm", "-o", "{judge_path}/main"],
            gid:12001,
            uid:12001,
        },
        judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "{judge_path}/main",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "{input}",
            output_path: "{user_output}",
            error_path: "{judge_path}/{point_num}/error_out",
            log_path: "{judge_path}/{point_num}/judge_log",
            cwd:"{judge_path}/{point_num}",
            args:[],
            seccomp_rule_name: "c_cpp_file_io",
            gid:12002,
            uid:12002,
        },
        spj_compile_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/g++",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/spj_output",
            error_path: "{judge_path}/spj_error_path",
            log_path: "{judge_path}/spj_compile_log",
            args: [ "-DONLINE_JUDGE", "-std=c++11", "{spj_src_path}", "-lm", "-o", "{spj_path}"],
            env:["PATH=/usr/bin"],
            gid:12003,
            uid:12003,
        },
        spj_judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "{spj_path}",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/{point_num}/spj_output",
            error_path: "{judge_path}/{point_num}/spj_error_path",
            log_path: "{judge_path}/{point_num}/spj_log",
            args: ["{input}","{user_output}","{raw_output}"],
            cwd:"{judge_path}/{point_num}",
            gid:12003,
            uid:12003,
        },
    },
    //======================== PYHTON3
    "py":{
        compile_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/python3",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/compile_output",
            error_path: "{judge_path}/compile_error",
            log_path: "{judge_path}/compile_log",
            args: [ "-m", "py_compile","{src_path}"],
            env:["PATH=/usr/bin"],
            cwd:"{judge_path}",
            gid:12001,
            uid:12001,
        },
        judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/python3",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "{input}",
            output_path: "{user_output}",
            error_path: "{judge_path}/{point_num}/error_out",
            log_path: "{judge_path}/{point_num}/judge_log",
            cwd:"{judge_path}/{point_num}",
            args: ["{src_path}"],
            seccomp_rule_name: "general",
            gid:12002,
            uid:12002,
        },
        spj_compile_args:undefined, //不用编译
        spj_judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "/usr/bin/python3",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/{point_num}/spj_output",
            error_path: "{judge_path}/{point_num}/spj_error_path",
            log_path: "{judge_path}/{point_num}/spj_log",
            args: ["{spj_src_path}","{input}","{user_output}","{raw_output}"],
            cwd:"{judge_path}/{point_num}",
            gid:12003,
            uid:12003,
        },
    },
    "testlib":{
        // not user 
        compile_args:undefined,
        judge_args:undefined,
        spj_compile_args:undefined, //not user
        spj_judge_args:{
            max_cpu_time: 10000,
            max_real_time: 30000,
            exe_path: "{spj_path}",
            max_memory: 536870912,//  512mb
            max_stack: 536870912,
            max_output_size: 536870912,
            input_path: "/dev/null",
            output_path: "{judge_path}/{point_num}/spj_output",
            error_path: "{judge_path}/{point_num}/spj_error_path",
            log_path: "{judge_path}/{point_num}/spj_compile_log",
            args: ["{input}","{user_output}","{raw_output}"],
            cwd:"{judge_path}/{point_num}",
            gid:12003,
            uid:12003,
        },
    }
}

export default language_template
