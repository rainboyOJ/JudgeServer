/* 
 * 生成 评测的基本地址 judge_base_path
 * */
import config from '../../lib/CONFIG'
import {join} from 'path'
import debug from '../../lib/debug'

const lang_ext_map =  {
    'cpp': 'cpp',
    'c++':'cpp',
    'c':'c',
    'python':'py',
    'javascript':'js',
    'js':'js',
    "nodejs":'js'
}

export = async function generate_path_args(ctx:CTX.ctx,next:Function){

    ctx.config.judge_path = join(
        config.get_config().JUDGE_BASE_PATH,
        <string>ctx.config.uuid
    )

    ctx.config.data_path = join(
        config.get_config().DATA_BASE_PATH,
        ctx.post_judge_data.id+''
    )

    let lang = ctx.post_judge_data.lang.toLowerCase();
    if(lang_ext_map.hasOwnProperty(lang)){
        ctx.config.src_path = join(
            ctx.config.judge_path,
            //@ts-ignore
            "main."+ lang_ext_map[lang]
        )
    }
    else{
        let message = `ctx.post_judge_data.lang : ${ctx.post_judge_data.lang} 并不支持这种语言!`
        debug.debug(message)
        throw(message)
        return
    }

    await next()
}
