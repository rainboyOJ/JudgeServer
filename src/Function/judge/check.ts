/** 
 *  spj 判断
 * */

import {existsSync} from 'fs'
import * as Judger from  '../../../Judger/bindings/NodeJS'
import {CTX} from '../../types/global' 

export = async function spj(ctx:CTX.ctx,next:Function){
    let result = <CTX.result> ctx.result
    if( result.result == 0) {  // 评测 正常结束
        if( existsSync(<string>ctx.config.user_output)){
            let judge_result = Judger.run(<CTX.judge_args>ctx.spj_judge_args)
            if( judge_result.result !=0 ){
                ctx.result!.error = Judger.ERROR_SPJ_ERROR
            }
            else if( judge_result.exit_code != 0)
                ctx.result!.result = Judger.RESULT_WRONG_ANSWER
        }
        else { //没有输出
            ctx.result!.result = Judger.RESULT_WRONG_ANSWER
        }
    }
    await next()
}
