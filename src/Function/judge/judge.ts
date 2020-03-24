/** 
 *  评测
 * */

import { CTX } from '../../types/global';
import * as Judger from '../../../Judger/bindings/NodeJS'
export = async function judge(ctx:CTX.ctx,next:Function){
    let result = Judger.run(<CTX.judge_args>ctx.judge_args)
    ctx.result = result
    await next()
}
