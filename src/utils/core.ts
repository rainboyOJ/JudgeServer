import * as fs from 'fs'
import * as pathFn from 'path'
/* =================== 核心函数 ===================*/

/*方法说明
 *@method not_matched
 *@param {String} filename 文件名
 *@param {Array} fliters   过滤列表,reg
 *@return {Boolean} 是否不满足regExp列表
 *@desc 判断文件名是否不满足给出的 RegExp 列表
*/
export function not_matched(filename:string,fliters:RegExp[]=[]):Boolean{
    for( let reg of fliters){
        if(reg.test(filename))
            return false
    }
    return true;
}
/**
 *@method get_load_maps
 *@param {String} path 最上层的路径
 *@param {Array}  fliters 过滤的文件regExp数组
 *@return {Array} 文件列表
 *@desc 获得某个文件夹下的所有文件
*/
export function get_load_maps(path:string,fliters:RegExp[]=[]){
    let maps:any = []
    function _get_load_maps(path:string,rpath= ''){

        let files = fs.readdirSync(path);

        for( let file of files){
            if( !not_matched(file,fliters) ) //文件名来过滤
                continue;

            let newP = pathFn.join(path,file)
            let stat = fs.statSync(newP)

            if(stat.isDirectory()){ //文件夹
                let new_rpath = pathFn.join(rpath,file)
                _get_load_maps(newP,new_rpath)
            }
            else if( stat.isFile()){ //文件
                maps.push({ 
                    path,       //当前文件的路径
                    rpath,      //相当传进来的最基础路径的 相对路径
                    file,       //文件名
                    basename:file.split(".")[0],    //去除后缀的名字
                    full_path:pathFn.join(path,file),
                    extname:pathFn.extname(file)  //后缀名
                })
            }
        }
    }
    _get_load_maps(path)
    return maps
}

/**
 *@method maps_2_deal
 *@param {String} path 加载文件的路径
 *@param {Array} fliters RegExp列表,只要满足其中的一个,文件就会被过滤
 *@param {Function} func 处理的函数,它的接收的参数见 get_load_maps
 *@return {null} 无返回值
 *@desc 处理路径下的所有文件
 */
export function maps_2_deal(path:string,fliters:RegExp[]=[],func:Function){
    let maps = get_load_maps(path,fliters)
    for(let m of maps){
        func(m)
    }
}
