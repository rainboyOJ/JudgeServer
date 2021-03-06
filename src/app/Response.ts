/** 订阅消息的处理 */

import * as socket from 'socket.io'
import debug from '../lib/debug'
import {RESPONSE} from '../types/global'
class response {
    nsp:socket.Namespace
    constructor(nsp:socket.Namespace){
        this.nsp = nsp
    }

    deal(res:RESPONSE){ //发送数据给 客户端
        let {socket_client_id} = res
        this.send(socket_client_id,res)
    }

    send(id:string,data:RESPONSE){
        if(this.nsp.sockets[id])
            this.nsp.sockets[id].emit('judge_response',data)
        else
            console.error(`not found socket_client_id ${id},send judge_response message failed!`)
    }
}

export default response
