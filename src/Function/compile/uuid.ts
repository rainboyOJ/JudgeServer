import {generate} from 'shortid'

export = async function uuid(ctx:CTX.ctx,next:Function){
    ctx.config.uuid = generate()
    await next();
}
