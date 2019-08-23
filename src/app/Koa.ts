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



    return app;
}

