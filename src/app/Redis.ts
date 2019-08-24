import * as Redis from 'ioredis'
import config from '../lib/CONFIG'
import debug from '../lib/debug'
import Redis from './Redis'


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
                debug('publish connect success!')
            })
        }

        /** 订阅用的连接 */
        if(opts.subscribe){
            this.SUBSCRIBE = new Redis(opts.subscribe)
            this.SUBSCRIBE.on('connect',()=>{
                debug('subscribe optsnect success!')
            })
        }

        /** 编译队列用连接*/
        if( opts.compile_queue){
            this.COMPILE_QUEUE = new Redis(opts.compile_queue)
        }

        /** 评测队列用连接 */
        if( opts.judge_queue){
            this.JUDGE_QUEUE = new Redis( opts.judge_queue)
        }
    }

    /** 监听信息 */
    SUBSCRIBE_INIT(fn:any){
        /** 先订阅 */
        this.SUBSCRIBE!.subscribe('publish_message',(err:any,count:number)=>{
            if(!err)
                debug(`订阅成功 编号:${count}`)
        })
        this.SUBSCRIBE!.on('message',fn)
    }

    /** 发布信息 */
    PUBLISH_MESSAGE(message:any):Promise<any>{
        if( typeof(message) === 'string')
            return this.PUBLISH!.publish('publish_message',<string>message)
        return this.PUBLISH!.publish('publish_message',JSON.stringify(message))
    }
}
export default new myredis(config.get_config()['REDIS'])

