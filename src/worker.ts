/** 工作 */
import {delay,maps_2_deal} from './utils/index'
import Redis from './app/Redis'
import debug from './lib/debug'
import * as routeIns from 'koa-route-ex'
debug.debug("=== start worker ===")


/** 注册 函数 */
maps_2_deal(__dirname +'/Function',[/^_/],function(data:any){
    routeIns.register(require(data.full_path), data.rpath)
})


async function main(){
    while(1){

        let judge_ctx:CTX.ctx | null = await Redis.judge_pop()
        if( judge_ctx != null){
            debug.debug('取出 judge_queue 里的数据')
            debug.debug(judge_ctx)

            await Redis.PUBLISH_MESSAGE({
                socket_client_id:judge_ctx.config!.socket_client_id,
                result:0
            })

        }
        else{
            debug.debug('没有 从取出 judge_queue 里的数据')
            let compile_ctx:CTX.ctx |null = await Redis.compile_pop()
            if( compile_ctx != null){
                debug.debug('取出 compile_queue 里的数据')
                debug.detail(compile_ctx)

                await Redis.judge_push(compile_ctx)

            }
            else {
                debug.debug('没有 从取出 compile_queue 里的数据')
            }
        }
        
        
        await delay(1000);
    }
}

main()
