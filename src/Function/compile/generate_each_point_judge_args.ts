/** 
 * 生成每个点  judge spj 的参数
 * */
import config from '../../lib/CONFIG'
import {deep_format} from '../../utils'
import get_lang_ext from '../../lib/get_lang_ext'
import Redis from '../../app/Redis'

export = async function generate_each_point_judge_args(ctx:CTX.ctx,next:Function){
    //根据 post_judge_data 生成相应的参数
    let default_config = config.get_config()
    let lang = get_lang_ext(ctx.post_judge_data.lang)
    let {spj_ext} = ctx.config
    let template = config.get_languge_template(lang)!['judge_args']
    let spj_template = config.get_languge_template(<string>spj_ext)!['spj_judge_args']

    let user_set_judge_args:{[k:string]:any} = {}

    if( ctx.post_judge_data.time){
        user_set_judge_args['max_cpu_time'] = ctx.post_judge_data.time 
        user_set_judge_args['max_real_time'] = 5* user_set_judge_args['max_cpu_time']
    }

    if( ctx.post_judge_data.memory)
        user_set_judge_args['max_memory'] = ctx.post_judge_data.memory*1024*1024+ default_config.JUDGE_EXTRA_MEMORY * 1024*1024;

    if( ctx.post_judge_data.stack)
        user_set_judge_args['max_stack'] = ctx.post_judge_data.stack * 1024 *1024
    let arr:CTX.ctx[] = []

    for( let i =0,len = ctx.judge_data_list!.length;i<len ;i++){
        let [input,output,user_output] = ctx.judge_data_list![i]
        let ctx_config = { 
            ...ctx.config,
            point_num:i+'',
            input,
            output,
            user_output
        }
        //@ts-ignore
        let judge_args = deep_format(template,ctx_config)
        //@ts-ignore
        judge_args = {...judge_args,...user_set_judge_args}

        //@ts-ignore
        let spj_judge_args = deep_format(spj_template,ctx_config)

        arr.push(
            <CTX.ctx>{
                ...ctx,
                config: {...ctx_config,type:'judge'},
                judge_args,
                spj_judge_args,
                method:'GET',
                path:'/judge'
            }
        )

    }
    /** Redis 的 评测点的数量 */
    await Redis.set_judge_point(ctx.config.uuid!, arr.length)
    /** 加入的 评测队列 */
    for( let c of arr){
        await Redis.judge_push(c)
    }

    await next();
}


