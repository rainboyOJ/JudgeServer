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
    "compile.generate_path_args",           // judge_path data_path src_path 
    "compile.generate_spj_args",            // spj_ext ,spj_path,spj_src_path
    "compile.generate_compile_args",
    "compile.generate_spj_compile_args",    // 生成 ctx.spj_compile_arg
    "compile.data_validate",
    "compile.create_data_dir_and_file",
    "compile.create_src",                   // 生成 源代码
    "compile.compile_src",                  // 编译源代码
    "compile.compile_spj_src",              //编译spj源代码
    "compile.generate_each_point_judge_args"//生成每个测试点的 ctx
])

//@ts-ignore
var judge_routes = routeIns.create('/judge', [
    "judge.judge",
    "judge.spj",
])


async function main(){
    while(1){

        let pop_ctx:CTX.ctx | null 
        let socket_client_id:string

        pop_ctx = await Redis.judge_pop()
        if(!pop_ctx){
            debug.info('取出 judge_queue 里的数据')
            pop_ctx = await Redis.compile_pop()
        }

        if( !pop_ctx){
            debug.info(`什么数据也没有取出!`)
        }
        else {
            socket_client_id = pop_ctx.config.socket_client_id
            try {
                //@ts-ignore
                await compile_routes.routes()(pop_ctx,async (ctx:CTX.ctx | undefined )=>{
                    if(ctx){
                        console.log("============ compile_routes exec END ==================================")
                        console.log(ctx)
                        console.log("==================================================================") }
                })
                //@ts-ignore
                await judge_routes.routes()(pop_ctx,async (ctx:CTX.ctx | undefined)=>{
                    /** 评测结束,进行相关处理 */
                    if( ctx) {
                        console.log(ctx)
                        // if ctx.judge_end === true
                        // REDIS.PUBLISH_MESSAGE
                    }
                })
            }
            catch(e){
                Redis.PUBLISH_MESSAGE({
                    socket_client_id:socket_client_id,
                    result: e.result || -1,
                    message:e.message || e,
                    result_list:[]
                });
            }
        }
        await delay(100);
    }
}

main()
