/** 订阅消息的处理 */

import * as socket from 'socket.io'
import debug from '../lib/debug'

class response {
    nsp:socket.Namespace
    constructor(nsp:socket.Namespace){
        this.nsp = nsp
    }

    deal(res:RESPONSE){
        debug("========== response ==========")
        debug(res)
    }

    send(id:string){
        if(this.nsp.sockets[id])
            this.nsp.sockets[id].emit('judge_response','pong')
    }
}

export default response
