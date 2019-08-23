import * as Koa from 'koa'
import * as logger from 'koa-logger'

/** 产生一个 Koa 实例 */
export const createServer = ():Koa => {
    var app = new Koa()
    app.use(logger())

    app.use(async function(ctx,next){
        if( ctx.method == 'GET' && ctx.path === '/')
            ctx.body = 'judgeServer Index'
        else
            await next();
    })


    return app;
}

