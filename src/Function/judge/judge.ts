/** 
 *  评测
 * */

import { CTX } from '../../types/global';
import * as Judger from '../../../Judger/bindings/NodeJS'
import debug from '../../lib/debug'
import {JUDGE_ERROR_MAP_NUM}from '../../lib/DEFINE'
export = async function judge(ctx:CTX.ctx,next:Function){
    
    try {
        ctx.result = Judger.run(<CTX.judge_args>ctx.judge_args)
    }
    catch(e){
        ctx.result = {
            real_time:0,cpu_time:0,signal:0,error:0,memory:0,exit_code:0,
            result: JUDGE_ERROR_MAP_NUM.JUDGE_CORE_ERROR,
            detail:e
        }
        throw({
            judge_uuid: ctx.config.uuid,
            result:`JUDGE_CORE_ERROR`,
            message:e,
            ctx
        })
    }

    //debug.info(ctx.config)
    //debug.info(ctx.result)

    //进行内存限制的检查
    if( ctx.result.result === 0){
        if( ctx.result.memory > ctx.post_judge_data.memory!*1024*1024 )
            ctx.result.result = Judger.RESULT_MEMORY_LIMIT_EXCEEDED;
    }
    await next()
}
