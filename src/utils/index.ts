/** 工具函数 */
import * as jsyaml from 'js-yaml'
import * as fs from 'fs'
import * as pathFn from 'path'
import * as format from 'string-format'

/** 加载yaml配置 */
export function load_yaml(path:string){
    return jsyaml.load(fs.readFileSync(path,{encoding:'utf-8'}));
}

/** JSON stringify */
export const JSON2STR = JSON.stringify
export const STR2JSON = JSON.parse



/** 
 * 得到路径读取文件,返回文件列表 
 * 会过滤文件夹,
 * */
export const fileList = (filePath:string)=>{
    let fl = fs.readdirSync(filePath)
    
    return fl.reduce( (d:string[],f:string)=>{
        let stat = fs.statSync( pathFn.join(filePath,f));
        if( stat.isFile())
            d.push(f)
        return d;
    },[])
}

/** 
 * 提取字符串的数据 
 *
 * 返回值:
 *  >= 0 正常
 *  < 0 不正常,没有数字
 * */
export const getNum  = (name:string):number=>{
    let numStr:string = name.replace(/[^0-9]/ig,"")
    if( numStr.length)
        return parseInt(numStr)
    else
        return -1

}

/** 
 * deep_format 深度格式化字符串
 * 
 * */
export function deep_format(obj:any_obj ,val:any_obj) {

    if(typeof(obj) === 'string')
        return format(obj,val)

    let o :any_obj = {}
    for( let k in obj){
        if( typeof(obj[k]) == 'string'){
            o[k] = format(obj[k],val)
        }
        else if(Array.isArray(obj[k])){
            o[k] = obj[k].map(
                function(d:any_obj){
                    return deep_format(d,val)
                }
            )
        }
        else if(typeof(obj[k]) == "object"){
            o[k] = deep_format(obj[k],val);
        }
    }

    return o;
}

