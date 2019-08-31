/** 
 * 创建 评测的源代码
 * */

import {writeFileSync} from 'fs'

export = async function create_src(ctx:CTX.ctx,next:Function){
    let {src_path }= ctx.config

    writeFileSync(<string>src_path,ctx.post_judge_data.code,{encoding:'utf-8'})

    await next()
}
