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
    await next()
}
