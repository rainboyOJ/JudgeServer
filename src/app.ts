import { createServer } from './app/Koa'
import {createSocket} from './app/Socket'
import Redis from './app/Redis'
import Response from './app/Response'
import {RESPONSE} from './types/global'

async function main(){
    try {
        var koa = createServer()
        let {server,nsp} =createSocket(koa); //在这里把提交的 post_judge_data 放入队列

        koa.use(async function(ctx,next){
            if( ctx.method == 'GET' && ctx.path === '/'){
                await ctx.render('index',{
                    clients:Object.keys(nsp.sockets) 
                })
            }
            else
                await next();
        })

        /**  Redis 订阅*/
        var response = new Response(nsp)
        Redis.SUBSCRIBE_INIT((data:RESPONSE)=>{ //订阅 消息处理
            response.deal(data)
        })



        server.listen(5000,() => {
            console.log('JudgeServer listen at port:',5000)
        })
    }
    catch(e){
        console.error(e)
    }
}
main()
