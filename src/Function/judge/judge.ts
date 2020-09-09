/** 
 *  评测
 * */

import { CTX } from '../../types/global';
import * as Judger from '../../../Judger/bindings/NodeJS'
import debug from '../../lib/debug'
export = async function judge(ctx:CTX.ctx,next:Function){
    let result = Judger.run(<CTX.judge_args>ctx.judge_args)
    ctx.result = result
    //debug.info(ctx.config)
    //debug.info(result)
    //debug.info(ctx.result)

    //进行内存限制的检查
    if( result.result === 0){
        if( result.memory > ctx.post_judge_data.memory!*1024*1024 )
            result.result = Judger.RESULT_MEMORY_LIMIT_EXCEEDED;
    }
    await next()
}
