import { CTX } from '../../types/global';
import language_template from '../../lib/languge_template'
import * as Judger from '../../../Judger/bindings/NodeJS'
import get_language_ext from '../../lib/get_lang_ext'
import {deep_format} from '../../utils';
import {promises, PathLike, mkdirSync,writeFileSync,chownSync,readFileSync} from 'fs'
import debug from '../../lib/debug'

const compiler_uid = 12001
const compiler_gid = 12001

export = async function compile_spj(ctx:CTX.ctx,next:Function){
        //ctx.spj_compile_arg 
        //py js 不需要编译
        //data目录下 查找 [spj.cpp,spj.py,spj.js]

    //如果 是 默认的spj 就不需要编译
    if( ctx.config.spj_ext !== 'testlib'){

        //产生compile 的参数
        let lang = get_language_ext(<string>ctx.config.spj_ext)
        if( language_template.hasOwnProperty(lang)){
            let spj_compile_args= {...language_template[lang].spj_compile_args}
            if( spj_compile_args ){ // 如果 compile_args == null 就表示不用编译

                //@ts-ignore
                ctx.spj_compile_args = deep_format(spj_compile_args, ctx.config)
                mkdirSync(<PathLike>ctx.config.judge_path,{recursive:true})
                chownSync(<PathLike>ctx.config.judge_path,compiler_uid,compiler_gid)
                //debug.info(ctx.spj_compile_args)
                let result = Judger.run(<CTX.judge_args>ctx.spj_compile_args)
                if(result.result != 0){ //编译失败
                    throw({
                        result:'compile_spj_error',
                        message: readFileSync(<PathLike>(<CTX.judge_args>ctx.spj_compile_args).error_path,{encoding:'utf-8'})
                    })
                }
            }
        }
    }
    await next()
}
