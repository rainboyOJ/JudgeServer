/** 
 * 创建 数据目录 或 数据文件 symbol link
 * */

import {ensureSymlinkSync,mkdirpSync} from 'fs-extra'
import {chmodSync} from 'fs'
import {join} from 'path'

export = async function create_data_dir_and_file(ctx:CTX.ctx,next:Function){
    ctx.judge_data_list = []
    for(let i = 0;i <ctx.data_list!.length; i++ ){
        let _path =  join(ctx.config.judge_path!,i+'')
        mkdirpSync(_path)
        let in_file_name = ctx.post_judge_data.auto_io ? ctx.data_list![i][0] : ctx.post_judge_data.file_in!;
        let out_file_name = ctx.post_judge_data.auto_io ? ctx.data_list![i][1] : ctx.post_judge_data.file_out!;

        let input = join(_path,in_file_name)
        let output = join(ctx.config.data_path!,ctx.data_list![i][1])
        let user_output = join(_path,out_file_name)
        ensureSymlinkSync(
            join(ctx.config.data_path!,ctx.data_list![i][0]),
            input
        )
        ctx.judge_data_list.push(
            [input,output,user_output]
        )

        chmodSync(_path,0o777)
    }
    await next()
}
