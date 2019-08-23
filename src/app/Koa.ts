import * as Koa from 'koa'
import * as logger from 'koa-logger'

/** 产生一个 Koa 实例 */
export const createServer = ():Koa => {
    var app = new Koa()
    app.use(logger())
    return app;
}

