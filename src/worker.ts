/** 工作 */
import {delay,maps_2_deal} from './utils/index'
import Redis from './app/Redis'
import debug from './lib/debug'
import * as RouteIns from 'koa-route-ex'
import {CTX} from './types/global'
import compare_data = require('./Function/compile/compare_data');
debug.info("=== start worker ===")

//@ts-ignore
const routeIns = new RouteIns()
/** 注册 函数 */
maps_2_deal(__dirname +'/Function',[/^_/,/.swp$/],function(data:any){
    debug.debug(`注册函数: namespace : ${data.rpath},name: ${data.basename} `)
    routeIns.register(require(data.full_path), data.rpath)
})

// @ts-ignore
var compile_routes = routeIns.create('/compile',[
    "compile.compare_config",           // -> 准备 ctx.config 数据
    "compile.compare_data",             // -> 准备 ctx.data 
    "compile.compile_src",              // -> 编译 源代码
    "compile.compile_spj",              // -> 编译 spj
    "compile.compare_operate",          // -> 生成测试数据ctx,放入队列,准备好每个测试数据
])

//@ts-ignore
var judge_routes = routeIns.create('/judge', [
    "judge.judge",
    "judge.spj",
    "judge.judge_end"
])


async function main(){
    while(1){

        let pop_ctx:CTX.ctx | null 
        let socket_client_id:string

        pop_ctx = await Redis.judge_pop()
        if(!pop_ctx){
            debug.info('没用从 judge_queue 里的取出数据')
            pop_ctx = await Redis.compile_pop()
            if(pop_ctx) debug.info('取出数据成功: [compile_queue ]')
        }
        else debug.info('取出数据成功: [judge_queue]')

        if( !pop_ctx){
            debug.info('没用从 compile_queue 里的取出数据')
        }
        else {
            socket_client_id = pop_ctx.config.socket_client_id
            try {
                //@ts-ignore
                await compile_routes.routes()(pop_ctx,async (ctx:CTX.ctx | undefined )=>{
                    //if(ctx){
                        //console.log("============ compile_routes exec END ==================================")
                        //console.log(JSON.stringify(ctx,null,4))
                        //console.log("==================================================================") 
                    //}
                })
                //@ts-ignore
                await judge_routes.routes()(pop_ctx,async (ctx:CTX.ctx | undefined)=>{
                    /** 评测结束,进行相关处理 */
                    if( ctx) {
                        debug.detail(ctx)
                        // if ctx.judge_end === true
                        // REDIS.PUBLISH_MESSAGE
                    }
                })
            }
            catch(e){
                Redis.PUBLISH_MESSAGE({
                    socket_client_id:socket_client_id,
                    uid: (<CTX.ctx>pop_ctx).post_judge_data.uid,
                    result: e.result || -1,
                    message:e.message || e,
                    result_list:[]
                });
            }
        }
        await delay(100);
    }
}

export default main

//如果直接调用本文件,就执行一个worker
if( process.mainModule!.filename === __filename)
    main();
