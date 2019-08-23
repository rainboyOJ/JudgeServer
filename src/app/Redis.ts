import * as Redis from 'ioredis'

export interface MYREDIS_constructor_params {
    subscribe?: string ,
    publish?: string ,
    compile_queue?: string ,
    judge_queue?: string 
}

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
}
