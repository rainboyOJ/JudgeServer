/** 
 * 生成 spj compile args
 * */
import config from '../../lib/CONFIG'
import {deep_format} from '../../utils'
import debug from '../../lib/debug'

export = async function generate_spj_compile_args(ctx:CTX.ctx,next:Function){

    let {spj_ext} = ctx.config
    let lang_template = config.get_config()['LANGUGE_TEMPLATE']

    if( lang_template.hasOwnProperty(<string>spj_ext)){
        let spj_compile_args = {...lang_template[<string>spj_ext].spj_compile_args}
        if( spj_compile_args ){
            //@ts-ignore
            ctx.spj_compile_arg =  deep_format(spj_compile_args,ctx.config)
        }
    }
    else 
        throw(debug.msg(`没有找到 ${spj_ext} 的spj_compile_args ,LANGUGE_TEMPLATE`))
    await next()
}
