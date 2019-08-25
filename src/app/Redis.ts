import * as Redis from 'ioredis'
import config from '../lib/CONFIG'
import debug from '../lib/debug'


export interface MYREDIS{
    /** 发布 用的Redis实例 */
    PUBLISH: Redis.Redis | undefined

    /** 订阅 用的Redis实例 */
    SUBSCRIBE: Redis.Redis | undefined

    /** 编译队列 用的Redis实例 */
    COMPILE_QUEUE: Redis.Redis | undefined

    /** 评测队列 用的Redis实例 */
    JUDGE_QUEUE: Redis.Redis | undefined
}

class myredis implements MYREDIS {
    /** 发布 用的Redis实例 */
    PUBLISH: Redis.Redis | undefined = undefined

    /** 订阅 用的Redis实例 */
    SUBSCRIBE: Redis.Redis | undefined = undefined

    /** 编译队列 用的Redis实例 */
    COMPILE_QUEUE: Redis.Redis | undefined = undefined

    /** 评测队列 用的Redis实例 */
    JUDGE_QUEUE: Redis.Redis | undefined = undefined

    constructor( opts : MYREDIS_constructor_params){

        /** 发布用的连接 */
        if (opts.publish){
            this.PUBLISH = new Redis(opts.publish)
            this.PUBLISH.on('connect',()=>{
                debug.debug('publish connect success!')
            })
        }

        /** 订阅用的连接 */
        if(opts.subscribe){
            this.SUBSCRIBE = new Redis(opts.subscribe)
            this.SUBSCRIBE.on('connect',()=>{
                debug.debug('subscribe optsnect success!')
            })
        }

        /** 编译队列用连接*/
        if( opts.compile_queue){
            this.COMPILE_QUEUE = new Redis(opts.compile_queue)
            this.COMPILE_QUEUE.on('connect',()=>{
                debug.debug('compile_queue connect success!')
            })
        }

        /** 评测队列用连接 */
        if( opts.judge_queue){
            this.JUDGE_QUEUE = new Redis( opts.judge_queue)
            this.JUDGE_QUEUE.on('connect',()=>{
                debug.debug('judge_queue connect success!')
            })
        }
    }

    /** 监听信息 */
    SUBSCRIBE_INIT(fn:Function){
        /** 先订阅 */
        this.SUBSCRIBE!.subscribe('publish_message',(err:any,count:number)=>{
            if(!err)
                debug.debug(`订阅成功 编号:${count}`)
        })
        this.SUBSCRIBE!.on('message',function(name:string,data:string){
            try{
                fn(JSON.parse(data))
            }
            catch(e){
                console.error(`data must be JSON string!`)
            }
        })
    }

    /** 发布信息 */
    PUBLISH_MESSAGE(message:any):Promise<any>{
        debug.detail("==============================")
        debug.detail(message)
        if( typeof(message) === 'string')
            return this.PUBLISH!.publish('publish_message',<string>message)
        return this.PUBLISH!.publish('publish_message',JSON.stringify(message))
    }

    /** 生产 */
    compile_push(data:CTX.ctx){
        return this.COMPILE_QUEUE!.lpush('compile_queue',JSON.stringify(data))
    }

    /** 消费 */
    async compile_pop():Promise< CTX.ctx| null>{
        // @ts-ignore
        let res = await this.COMPILE_QUEUE!.brpop('compile_queue',config.CONFIG['COMPILE_QUEUE_DELAY_TIME'] || 2)
        try {
            return <CTX.ctx>JSON.parse(res[1])
        }
        catch(e){
            return null
        }
    }

    /** 生产:评测队列 */
    judge_push(data:CTX.ctx){
        return this.JUDGE_QUEUE!.lpush('judge_queue',JSON.stringify(data))
    }

    /** 消费:评测队列 */
    async judge_pop():Promise<CTX.ctx | null>{
        // @ts-ignore
        let res = await this.JUDGE_QUEUE!.brpop('judge_queue',config.CONFIG['JUDGE_QUEUE_DELAY_TIME'] || 2)

        try{
            return <CTX.ctx>JSON.parse(res[1])
        }
        catch(e){
            return null
        }
    }
}
export default new myredis(config.get_config()['REDIS'])

