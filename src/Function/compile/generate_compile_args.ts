/** 
 * 生成 评测的编译参数
 * */
import config from '../../lib/CONFIG'
import {deep_format} from '../../utils'
import get_lang_ext from '../../lib/get_lang_ext'

export = async function generate_compile_args(ctx:CTX.ctx,next:Function){
    let lang_template = config.get_config()['LANGUGE_TEMPLATE']
    let lang = get_lang_ext(ctx.post_judge_data.lang)

    if( lang_template.hasOwnProperty(lang)){
        let compile_args = {...lang_template[lang].compile_args}
        //@ts-ignore
        ctx.compile_args = deep_format(compile_args,ctx.config)

        //ctx.spj_compile_arg 
        // 如果 是 默认的spj 就不需要编译
        // py js 不需要编译

        await next()
    }
    else {
        throw(`在配置文件 config(_default).yaml 中没有对应 ${lang} 语言的 LANGUGE_TEMPLATE`)
        return
    }

}
