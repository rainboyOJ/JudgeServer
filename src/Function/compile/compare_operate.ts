/** 
 * 准备:操作阶段
 * */

import {promises, PathLike, mkdirSync,linkSync,chmodSync ,chownSync} from 'fs'
import {join,extname,basename,dirname} from 'path'
import { CTX } from '../../types/global';
import {async} from 'q';
const {readdir,mkdir} = promises
import {deep_format} from '../../utils'
import get_language_ext from '../../lib/get_lang_ext'
import language_template from '../../lib/languge_template'
import debug from '../../lib/debug'
import judge = require('../judge/judge');
import {BASE_MB} from '../../lib/CONFIG'
import Redis from '../../app/Redis'

const code_uid= 12002
const code_gid = 12002

export = async function compare_operate(ctx:CTX.ctx,next:Function){
    debug.info("============ compare_operate ============")
    let judge_ctx:CTX.ctx[] = []
    for( let i = 0 ;i<ctx.data.list.length ;i++){
        judge_ctx.push(<CTX.ctx>{
            method: 'GET',
            path: "/judge",
            post_judge_data:ctx.post_judge_data,
            config:{...ctx.config,type:"judge",point_num:i},
            judge_args:{},
            spj_judge_args:{}
        })
    }
    //1. 创建文件夹
    //TODO: change mode for compile
    //await mkdir(<string>ctx.config.judge_path,{recursive:true})
    ctx.data.list.map( ({raw_input,raw_output,input,user_output,idx})=>{
        //TODO: change mode for nobody
        mkdirSync(dirname(<string>input),{recursive:true})
        chownSync(dirname(<string>input), code_gid,code_uid)
        //chmodSync(dirname(<string>input), 0o777)
        // 创建输入数据的link
        linkSync(raw_input,input)
        idx = <number>idx

        //========================== judge_args
        let lang = get_language_ext( judge_ctx[idx].post_judge_data.lang )
        let judge_args = {...language_template[lang].judge_args}

        //@ts-ignore
        judge_ctx[idx].judge_args = deep_format(judge_args,{...judge_ctx[idx].config,raw_input,input,user_output,raw_output})
        if( ctx.post_judge_data.memory )
            //@ts-ignore
            judge_ctx[idx].judge_args.max_memory =  ctx.post_judge_data.memory * 1024*1024 + (BASE_MB)*1024*1024
        if( ctx.post_judge_data.time ){
            //@ts-ignore
            judge_ctx[idx].judge_args.max_cpu_time =  ctx.post_judge_data.time
            //@ts-ignore
            judge_ctx[idx].judge_args.max_real_time =  10*ctx.post_judge_data.time
        }
        if( ctx.post_judge_data.stack)
            //@ts-ignore
            judge_ctx[idx].judge_args.max_stack =  ctx.post_judge_data.stack * 1024 *1024

        if( ctx.post_judge_data.auto_io == false){ //不使用 自动io
            //@ts-ignore
            judge_ctx[idx].judge_args.input_path = '/dev/stdin'
            //@ts-ignore
            judge_ctx[idx].judge_args.output_path = '/dev/stdout'
        }

        //========================== spj_judge_args
        let spj_lang = get_language_ext(<string>ctx.config.spj_ext)
        let spj_judge_args = {...language_template[lang].spj_judge_args}

        //@ts-ignore
        judge_ctx[idx].spj_judge_args = deep_format(spj_judge_args,{...judge_ctx[idx].config,raw_input,input,user_output,raw_output})

    })
    debug.info(JSON.stringify(judge_ctx,null,4))

    //设置评测点的数量
    await Redis.set_judge_point(<string>ctx.config.uuid, judge_ctx.length)
    //加入评测数据进入judge_queue
    for( let _ctx of judge_ctx){
        await Redis.judge_push(_ctx)
    }
    await next()
}

