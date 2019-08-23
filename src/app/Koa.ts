import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as views from 'koa-views'

/** 产生一个 Koa 实例 */
export const createServer = ():Koa => {
    var app = new Koa()
    app.use(logger())
    app.use(views("views",{
        extension:'pug'
    }))

    app.use(async function(ctx,next){
        if( ctx.method == 'GET' && ctx.path === '/'){
            await ctx.render('index',{
                content:'hello world, JudgeServer!'
            })
        }
        else
            await next();
    })


    return app;
}

