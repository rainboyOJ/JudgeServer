/** 工作 */
import {delay} from './utils/index'
import Redis from './app/Redis'
import debug from './lib/debug'
debug("=== start worker ===")

async function main(){
    while(1){

        let judge_ctx:CTX.ctx | null = await Redis.judge_pop()
        if( judge_ctx != null){
            debug('取出 judge_queue 里的数据')
            debug(judge_ctx)

        }
        else{
            debug('没有 从取出 judge_queue 里的数据')
            let compile_ctx:CTX.ctx |null = await Redis.compile_pop()
            if( compile_ctx != null){
                debug('取出 compile_queue 里的数据')
                debug(compile_ctx)

            }
            else {
                debug('没有 从取出 compile_queue 里的数据')
            }
        }
        
        
        await delay(1000);
    }
}

main()
