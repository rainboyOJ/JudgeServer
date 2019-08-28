/* 
 * 生成 评测的基本地址 judge_base_path
 * */
import config from '../../lib/CONFIG'
import {join} from 'path'
//import debug from '../../lib/debug'
import get_lang_ext from '../../lib/get_lang_ext'


export = async function generate_path_args(ctx:CTX.ctx,next:Function){

    ctx.config.judge_path = join(
        config.get_config().JUDGE_BASE_PATH,
        <string>ctx.config.uuid
    )

    ctx.config.data_path = join(
        config.get_config().DATA_BASE_PATH,
        ctx.post_judge_data.id+''
    )

    ctx.config.src_path = join(
        ctx.config.judge_path,
        "main."+ get_lang_ext(ctx.post_judge_data.lang)
    )
    await next()
}
