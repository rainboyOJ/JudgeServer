/** 
 * 数据目录的相关检查
 * */
import {statSync,existsSync, PathLike} from 'fs'
import debug from '../../lib/debug'

import data_list from '../../lib/data_list'

export = async function data_validate(ctx:CTX.ctx,next:Function){
    let data_path = ctx.config.data_path
    if( existsSync(<PathLike>data_path) && statSync(<PathLike>data_path).isDirectory()) {

        ctx.data_list = data_list(<string>ctx.config.data_path)['both_list']
    }
    else {
        throw(debug.msg(`数据目录 ${data_path} 不存在`))
        return
    }

    await next();

}
