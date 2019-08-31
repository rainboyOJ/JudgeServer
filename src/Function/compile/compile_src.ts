/** 
 * 编译源代码
 * */
//const Judger = require("../../../Judger/bindings/NodeJS")
import * as Judger from '../../../Judger/bindings/NodeJS'
import {read_file_queue} from '../../utils/index'
export = async function compile_src(ctx:CTX.ctx,next:Function){
    if( ctx.compile_args){
        //console.log(ctx.compile_args)
        //var result = Judger.run(ctx.compile_args)
        var result:Judger.result = Judger.run(ctx.compile_args)
        if( result.result !=0  || result.error != 0 || result.signal != 0 ){
            let error_message = read_file_queue(<string>ctx.compile_args.log_path,<string>ctx.compile_args.error_path)
            if( error_message){
                throw({
                    message: error_message.replace(ctx.config.judge_path || '',''),
                    result: 1
                })
            }
            else{
                throw({
                    message:`未知的编译错误!`,
                    result: 1
                })
            }
        }
    }
    await next()
}
