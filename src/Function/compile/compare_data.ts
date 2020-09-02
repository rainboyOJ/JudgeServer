/** 
 * 准备阶段 生成ctx.data
 * */

import {promises, PathLike} from 'fs'
import {join,extname,basename} from 'path'
const {readdir} = promises
import { CTX } from '../../types/global';
import data_list from '../../lib/data_list'
import {load_yaml} from '../../utils/index'

export = async function compare_data(ctx:CTX.ctx,next:Function){
    ctx.data.raw_list = await readdir(<PathLike>ctx.config.data_path)
    //读取数据目录下的数据名[['data1.in','data1.out' ],...]
    let both_list = data_list(<string>ctx.config.data_path)['both_list']
    ctx.data.list = both_list.map( ([input,output],idx)=>{
        return {
            raw_input: join(<string>ctx.config.data_path,input),
            raw_output: join(<string>ctx.config.data_path,output),
            input: join(<string>ctx.config.judge_path,String(idx),<string>ctx.post_judge_data.file_in),
            user_output:join(<string>ctx.config.judge_path,String(idx),<string>ctx.config.user_output),
            idx
        }
    })

/*
 *    if( !ctx.data.raw_list.includes('data.yml')){ //数据目录下不包含data.yaml
 *
 *        //读取数据目录下的数据名[['data1.in','data1.out' ],...]
 *        let both_list = data_list(<string>ctx.config.data_path)['both_list']
 *        ctx.data.dataYML.inputFile = `#${extname(both_list[0][0])}`
 *        ctx.data.dataYML.outputFile = `#${extname(both_list[0][1])}`
 *        ctx.data.dataYML.subtasks[0].case = both_list.map( ([input,output])=>{return basename(input,extname(input))})
 *        //ctx.data.list = [ both_list.map(([input,output],idx)=>{
 *                //return { input: join(<string>ctx.config.data_path,input),
 *                    //output:     join(<string>ctx.config.data_path,output),
 *                    //user_output:join(<string>ctx.config.data_path,idx+'',<string>ctx.config.user_output) ,
 *                    //idx:`0.${idx}` }
 *            //}) ]
 *    }
 *    else {
 *        ctx.data.dataYML = load_yaml(join(<string>ctx.config.data_path,'data.yml'))
 *    }
 *    ctx.data.list = ctx.data.dataYML.subtasks.map((task,idx1)=>{
 *        return task.case.map((id,idx2)=>{
 *                let input_name = ctx.data.dataYML.inputFile.replace('#', id+'')
 *                let output_name= ctx.data.dataYML.outputFile.replace('#', id+'')
 *                let idx=  `${idx1}_${idx2}`
 *                return {
 *                    input: join(<string>ctx.config.data_path,input_name),
 *                    output: join(<string>ctx.config.data_path,output_name),
 *                    user_output:join(<string>ctx.config.judge_path,idx,<string>ctx.config.user_output),
 *                    idx,
 *                }
 *            })
 *    })
 *
 *    if(ctx.post_judge_data.auto_io) {
 *        ctx.data.list_for_auto_io = ctx.data.dataYML.subtasks.map((task,idx1)=>{
 *            return task.case.map((id,idx2)=>{
 *                let input_name = ctx.data.dataYML.inputFile.replace('#', id+'')
 *                let output_name= ctx.data.dataYML.outputFile.replace('#', id+'')
 *                let idx=  `${idx1}_${idx2}`
 *                return {
 *                    input: join(<string>ctx.config.judge_path,idx,<string>ctx.post_judge_data.file_in),
 *                    output: join(<string>ctx.config.data_path,output_name),
 *                    user_output:join(<string>ctx.config.judge_path,idx,<string>ctx.config.user_output),
 *                    idx,
 *                }
 *            })
 *        })
 *    }
 */
    await next()
}
