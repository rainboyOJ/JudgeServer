/** 
 * 编译源代码
 * */

//import config from '../../lib/CONFIG'
import debug from '../../lib/debug'
import {promises, PathLike, mkdirSync,writeFileSync,chownSync,readFileSync} from 'fs'
import {deep_format} from '../../utils'
import get_language_ext from '../../lib/get_lang_ext'
import { CTX } from '../../types/global';
import language_template from '../../lib/languge_template'
import * as Judger from '../../../Judger/bindings/NodeJS'

const compiler_uid = 12001
const compiler_gid = 12001

export = async function compile_src(ctx:CTX.ctx,next:Function){
    //1. 产生compile 的参数
    let lang = get_language_ext(ctx.post_judge_data.lang)

    if( language_template.hasOwnProperty(lang)){
        let compile_args = {...language_template[lang].compile_args}
        if( compile_args ){ // 如果 compile_args == null 就表示不用编译
            //@ts-ignore
            ctx.compile_args = deep_format(compile_args,ctx.config)
            mkdirSync(<PathLike>ctx.config.judge_path,{recursive:true})
            chownSync(<PathLike>ctx.config.judge_path,compiler_uid,compiler_gid)

            //生成源代码
            writeFileSync(<PathLike>ctx.config.src_path,<string>ctx.post_judge_data.code,{encoding:'utf-8'})
            let result = Judger.run(<CTX.judge_args>ctx.compile_args)
            //debug.info(JSON.stringify(result,null,4))
            if(result.result != 0){ //编译失败
                throw({
                    result:'compile_error',
                    message: readFileSync(<PathLike>(<CTX.judge_args>ctx.compile_args).error_path,{encoding:'utf-8'})
                })
            }
        }
        await next()
    }
    else {
        throw(`在配置文件 config(_default).yaml 中没有对应 ${lang} 语言的 LANGUGE_TEMPLATE`)
        return
    }

    //console.log(JSON.stringify(ctx,null,4))
    //await next()
}
