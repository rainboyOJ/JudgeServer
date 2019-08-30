/** 工作 */
import {delay,maps_2_deal} from './utils/index'
import Redis from './app/Redis'
import debug from './lib/debug'
import * as routeIns from 'koa-route-ex'
debug.info("=== start worker ===")


/** 注册 函数 */
maps_2_deal(__dirname +'/Function',[/^_/],function(data:any){
    debug.debug(`注册函数: namespace : ${data.rpath},name: ${data.basename} `)
    routeIns.register(require(data.full_path), data.rpath)
})

// @ts-ignore
var compile_routes = routeIns.create('/compile',[
    "compile.uuid",
    "compile.generate_path_args",
    "compile.generate_spj_args",    //spj_ext ,spj_path,spj_src_path
    "compile.generate_compile_args",
    "compile.data_validate",
    "compile.create_data_dir_and_file",
])


async function main(){
    while(1){

        let judge_ctx:CTX.ctx | null = await Redis.judge_pop()
        if( judge_ctx != null){
            debug.info('取出 judge_queue 里的数据')
            debug.detail(judge_ctx)

            await Redis.PUBLISH_MESSAGE({
                socket_client_id:judge_ctx.config!.socket_client_id,
                message:'',
                result:0
            })

        }
        else{
            debug.debug('没有 从取出 judge_queue 里的数据')
            let compile_ctx:CTX.ctx |null = await Redis.compile_pop()
            if( compile_ctx != null){
                debug.debug('取出 compile_queue 里的数据')
                debug.detail(compile_ctx)

                try {
                    //@ts-ignore
                    await compile_routes.routes()(compile_ctx, async (ctx:any)=>{ 
                        console.log("============ compile_routes exec END ==================================")
                        console.log(ctx)
                        console.log("==================================================================")
                    })
                    await Redis.judge_push(compile_ctx)
                }
                catch(e){
                    Redis.PUBLISH_MESSAGE({
                        socket_client_id:compile_ctx!.config.socket_client_id,
                        result:-1,
                        message:e.message || e,
                        result_list:[]
                    });
                }


            }
            else {
                debug.debug('没有 从取出 compile_queue 里的数据')
            }
        }
        
        await delay(1000);
    }
}

main()
