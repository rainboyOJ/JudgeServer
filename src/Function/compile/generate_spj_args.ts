/** 
 *  生成ctx.config.spj* 的参数
 * */

import {join} from 'path'
import {readdirSync,existsSync} from 'fs'
import * as format from 'string-format'
import config from '../../lib/CONFIG'

const default_inner_spj = {
    "spj.cpp": {
        spj_ext:'cpp',
        spj_path:`{judge_path}/spj`,
        spj_src_path:`{dta_path}/spj.cpp`
    },
    "spj.py": {
        spj_ext:'py',
        spj_path:`{data_path}/spj.py`,
        spj_src_path:`{dta_path}/spj.py`
    },
    "spj.js": {
        name:'spj.js',
        spj_ext:'js',
        spj_path:`{data_path}/spj.js`,
        spj_src_path:`{dta_path}/spj.js`
    }
}
export = async function generate_spj_args(ctx:CTX.ctx,next:Function){
    let spj_name = <string>ctx.post_judge_data.spj

    if( <string>spj_name.toLowerCase()  === "default")
        spj_name  = config.get_config()['DEFAULT_SPJ']


    if( spj_name.toUpperCase() === 'INNER'){
        let data_file_list = readdirSync(<string>ctx.config.data_path)


        for(let inner_spj_name in default_inner_spj){
            if( data_file_list.indexOf(inner_spj_name) !== -1){
                //ctx.config.spj_ext = 
                //@ts-ignore
                let {spj_ext,spj_path,spj_src_path} = default_inner_spj[inner_spj_name];
                ctx.config.spj_ext = spj_ext
                ctx.config.spj_path = format(spj_path,ctx.config)
                ctx.config.spj_src_path = format(spj_src_path,ctx.config)
                await next()
                return
            }
        }

        throw('数据目录下没有找到 ${Object.keys(default_inner_spj).join(,)}')


    }
    else {
        let default_spj_path = join(__dirname,'../../../testlib/output')
        console.log(default_spj_path)
        if( !existsSync(default_spj_path)){
            throw(`没有编译 testlib !`)
        }
        let default_spj_list = readdirSync(default_spj_path)
        if( default_spj_list.indexOf(spj_name)!= -1){
            ctx.config.spj_ext = 'testlib'

            ctx.config.spj_src_path = 
                ctx.config.spj_path = 
                    join(default_spj_path,spj_name);
        }
        else
            throw(`找不到spj : ${spj_name}`)
    }




    await next()
}
