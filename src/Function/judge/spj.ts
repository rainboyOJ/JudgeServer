/** 
 *  spj评测
 * */

import { CTX } from '../../types/global';
import * as Judger from '../../../Judger/bindings/NodeJS'
import debug from '../../lib/debug'
//import Judger = require('./judge');
import { read_file_queue }  from "../../utils/index"
export = async function spj(ctx:CTX.ctx,next:Function){
    let result = <CTX.result>(ctx.result)
    if(result.result !=0 || result.exit_code !=0 || result.error !=0){
        //评测不成功,不需要进行spj
        await next()
    }
    else {
        let spj_judge_args = <CTX.judge_args>ctx.spj_judge_args;
        let spj_result = Judger.run(spj_judge_args);
        /** 
         * 如果Judger 测试的程序返回值不是1,会导致runtime_error,导致result == 4
         * */
        if( spj_result.error !=0 || spj_result.signal != 0 || (spj_result.result >0 && spj_result.result != 4)){
            debug.info(ctx.spj_judge_args)
            debug.info(ctx.result)
            throw({
                result:"spj_judge_error", //spj 出现错误
                message: read_file_queue(<string>spj_judge_args.error_path,<string>spj_judge_args.log_path,<string>spj_judge_args.output_path) + "在测试点: " +ctx.config.point_num,
            })
        }
        //@ts-ignore
        (<CTX.result>ctx.result).result = spj_result.result == 0 ? 0 : -1;
        //debug.info("=========== spj-judge-result")
        //debug.info(spj_judge_args)
        //debug.info(spj_result)
        await next()
    }
}
