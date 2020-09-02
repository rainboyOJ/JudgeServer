/** 
 *  评测结束的相关处理
 * */
import Redis from '../../app/Redis'
import {removeSync} from 'fs-extra'
import { CTX,JUDGE_RESULT } from '../../types/global';
import debug from '../../lib/debug'

function parse_result(_result:string[]):JUDGE_RESULT[]{
    let ret = new Array(_result.length)
    _result.map( (r:string)=>{
        let {point_num,result} = JSON.parse(r)
        ret[point_num] = result
    })

    return ret
}
export = async function judge_end(ctx:CTX.ctx,next:Function){

    /** 减少一个 计数 */
    let left_judge_cnt = await Redis.dec_judge_point(<string>ctx.config.uuid)

    /** 把结果加入 结果队列 */

    await Redis.push_judge_result(<string>ctx.config.uuid, {
        point_num:<number>ctx.config.point_num,
        result:<CTX.result>ctx.result
    })

    debug.info(ctx.result)
    if( left_judge_cnt === 0){

        /** 取出所有的结果 */
        let _result:string[] = await Redis.get_all_judge_result(<string>ctx.config.uuid)
        //debug.info(_result)

        /** 删除 Redis 内的相关内容*/
        await Redis.del_judge_point(<string>ctx.config.uuid)
        await Redis.del_all_judge_result(<string>ctx.config.uuid)
        /** 删除 评测 文件夹 */
        removeSync(<string>ctx.config.judge_path)

        /** 发送评测结果 */
        await Redis.PUBLISH_MESSAGE({
            socket_client_id:ctx.config.socket_client_id,
            result: 0,
            message: 'OK',
            result_list: parse_result(_result)
        })
    }

    await next()
}
