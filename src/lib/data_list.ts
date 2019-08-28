import {fileList} from '../utils'
/* 输出 输入 数据的文件名的  reg*/
const { input_regs,output_regs} = {
    input_regs:[
        /([\w]*)\.in$/i,
        /([\w]*)\.input$/i,
        /([\w]*)input\w*\.txt$/i
    ],
    output_regs:[
        /([\w]*).out$/i,
        /([\w]*).output$/i,
        /([\w]*).ans$/i,
        /([\w]*)output\w*.txt$/i
    ],


}


const get_reg = (flist:string[],reg_array:RegExp[])=>{

    for (let reg of reg_array){
        for(let f of flist){  //找到第一个符合的
            if ( reg.test(f)){
                return reg
            }
        }
    }
    return false;
}

/* 输出匹配的文件列表 */
const file_filter = (flist:string[],reg:RegExp)=>{

    let list:string[] =  flist.reduce((d,f)=>{
        if( reg.test(f) )
            d.push(f)
        return d
    },<string[]>[])
    
    function sortNumber(a:string,b:string){
        let na = a.replace(/[^0-9]/ig,"")
        let nb = b.replace(/[^0-9]/ig,"")

        if(na.length == 0 || nb.length == 0)
            return 1;

        return parseInt(na)-parseInt(nb)
    }
    return list.sort(sortNumber)
}

export default (path:string)=>{
    //得到文件列表
    let fl = fileList(path)
    let input_reg  = get_reg(fl,input_regs)
    if( input_reg == false) throw(`输入文件没有找到:${path} at ${__filename}`)
    let output_reg = get_reg(fl,output_regs)
    if( output_reg == false) throw('`输出文件没有找到:${path} at ${__filename}`')
    
    let in_list = file_filter(fl,input_reg)
    let out_list = file_filter(fl,output_reg)

    if( in_list.length == 0 ||  out_list.length == 0 )
        throw(`目录:${path} 下数据为空 at ${__filename}`)

    if( in_list.length !== out_list.length)
        throw(`目录:${path} 下输入输出数据的数目不相等 at ${__filename}`)

    let both_list:[string,string][] = []

    for( let i in in_list)
        both_list.push( [in_list[i] ,out_list[i]])

    return {
        in_list,
        out_list,
        both_list,
        count:in_list.length
    }

}
