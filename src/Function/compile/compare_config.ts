/** 
 * 准备阶段 生成ctx.config
 * */

import {generate} from 'shortid'

import config from '../../lib/CONFIG'
import {join} from 'path'
//import debug from '../../lib/debug'
import get_lang_ext from '../../lib/get_lang_ext'


import {promises, PathLike,existsSync} from 'fs'
import { CTX } from '../../types/global';
const {readdir} = promises

export = async function compare_config(ctx:CTX.ctx,next:Function){
    //-> ctx.config.uuid
    ctx.config.uuid = generate()

    //-> ctx.config { judge_path,data_path,src_path}
    ctx.config.judge_path = join(
        config.get_config().JUDGE_BASE_PATH,
        <string>ctx.config.uuid
    )

    ctx.config.data_path = join(
        config.get_config().DATA_BASE_PATH,
        ctx.post_judge_data.id+''
    )
    //check
    if(!existsSync(<PathLike>ctx.config.data_path))
        throw(`${ctx.config.data_path} 数据目录不存在!`)

    ctx.config.src_path = join(
        ctx.config.judge_path,
        "main."+ get_lang_ext(ctx.post_judge_data.lang)
    )

    ctx.config.user_output = ctx.post_judge_data.file_out || 'userout'
    ctx.config.input = ctx.post_judge_data.file_in

    await next();
}
