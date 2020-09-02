/** 
 * 准备阶段 生成ctx.config
 * */

import {generate} from 'shortid'

import config from '../../lib/CONFIG'
import {TESTLIB_PATH,DEFAULT_CHECKER} from '../../lib/CONFIG'
import {join, extname} from 'path'
import debug from '../../lib/debug'
import get_lang_ext from '../../lib/get_lang_ext'


import {promises, PathLike,existsSync,readdirSync, readFileSync} from 'fs'
import { CTX } from '../../types/global';
const {readdir} = promises

/** 
 *  在ctx中生成 ctx.config 数据
 *  ctx {
 *      config : {
 *          uuid:string
 *          judge_path: path_like
 *          data_path: path_like
 *          src_path: path_like
 *          user_output: 输出的文件名
 *          input: 读入的数据名
 *      }
 *  }
 * */

export = async function compare_config(ctx:CTX.ctx,next:Function){
    debug.debug("this=========================")
    //-> ctx.config.uuid
    ctx.config.uuid = generate()

    //-> ctx.config { judge_path,data_path,src_path}
    ctx.config.judge_path = join(
        config.get_config().JUDGE_BASE_PATH,
        <string>ctx.config.uuid
    ).slice(0,-1)//去除路径最后一个 /

    ctx.config.data_path = join(
        config.get_config().DATA_BASE_PATH,
        ctx.post_judge_data.id+''
    )
    //check检查目录是否存在
    if(!existsSync(<PathLike>ctx.config.data_path))
        throw(`${ctx.config.data_path} 数据目录不存在!`)

    ctx.config.src_path = join(
        ctx.config.judge_path,
        "main."+ get_lang_ext(ctx.post_judge_data.lang)
    )

    ctx.config.user_output = ctx.post_judge_data.file_out || 'userout'
    ctx.config.input = ctx.post_judge_data.file_in

    //spj 相关参数的生成
    if(ctx.post_judge_data.spj === 'INNER'){ //数据目录内部的spj spj.cpp,spj.py,spj.js
        let file_in_data_path = readdirSync(<PathLike>ctx.config.data_path)
        let spjs = ["spj.cpp","spj.py","spj.js"]
        let spj
        for( let name of spjs){
            if(file_in_data_path.includes(name)){
                spj = name
                break
            }
        }
        if( !spj)
            throw(`没有在数据目录内找到spj代码,请确保含有${spjs.join(" ")}之一`)
        ctx.config.spj_ext = extname(spj).replace('.', "")
        ctx.config.spj_src_path = join(<string>ctx.config.data_path,spj)
        ctx.config.spj_path =join(<string>ctx.config.judge_path,'spj') 
    }
    else {  //使用testlib
        let testlib_files = readdirSync(TESTLIB_PATH)
        if(!ctx.post_judge_data.spj || ctx.post_judge_data.spj == 'default')
            ctx.post_judge_data.spj = DEFAULT_CHECKER
        if( !testlib_files.includes(ctx.post_judge_data.spj))
            throw(`在testlib目录下没有找到 ${ctx.post_judge_data.spj} `)
        ctx.config.spj_ext= 'testlib'
        ctx.config.spj_path = join(<string>TESTLIB_PATH,ctx.post_judge_data.spj)
    }

    debug.info("========生成数据如下:==========")
    debug.info(JSON.stringify(ctx.config,null,4))
    debug.info("===============================")

    await next();
}
