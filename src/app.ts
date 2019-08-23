import { createServer } from './app/Koa'
import {createSocket} from './app/Socket'


async function main(){
    try {
        var koa = createServer()
        let {server,nsp} =createSocket(koa);

        koa.use(async function(ctx,next){
            if( ctx.method == 'GET' && ctx.path === '/'){
                await ctx.render('index',{
                    clients:Object.keys(nsp.sockets) 
                })
            }
            else
                await next();
        })



        server.listen(5000,() => {
            console.log('JudgeServer listen at port:',5000)
        })
    }
    catch(e){
    }
}

main()
