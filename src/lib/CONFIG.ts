/* 返回配置
 * */

import {load_yaml} from '../utils/index'
import {join} from 'path'

class config {
    CONFIG:CONFIG | undefined
    constructor(path:string[]){
        for( let p of path){
            try {
                this.CONFIG = load_yaml(p)
                console.log(`加载配置成功: ${p}`)
                return
            }
            catch(e){
                //do nothing
            }
        }

        this.CONFIG = undefined
    }

    get_config(){
        return {...this.CONFIG}
    }

    get_languge_template(lang:string){
        if( this.CONFIG)
            return this.CONFIG.LANGUGE_TEMPLATE[lang]
    }
}

export default new config([
    join(__dirname,'../../config.yaml'),
    join(__dirname,'../../config_default.yaml')
])
