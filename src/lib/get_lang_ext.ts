const lang_ext_map = new Map([
    ['cpp', 'cpp'],
    ['c++','cpp'],
    ['c','c'],
    ['python','py'],
    ['python3','py'],
    ['py','py'],
    ['py3','py'],
    ['javascript','js'],
    ['js','js'],
    ["nodejs",'js'],
    ["javascript",'js']
])
export default function  get_lang_ext(lang:string):string{
    if( lang_ext_map.has(lang.toLowerCase())){
        return <string>lang_ext_map.get(lang.toLowerCase())
    }
    throw(`并不支持这种语言 ${lang}`)
}
