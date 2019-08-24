import * as socket from 'socket.io'
import * as Koa from 'koa'
import * as http from 'http'
import debug from '../lib/debug'


export const createSocket = (app:Koa) => {
    const server = http.createServer(app.callback())
    const io = socket(server)

    
    io.on('connection', function(socket){
        debug(`${socket.id} connected!`)

        /**  */
        socket.on('judge',function(this:socket.Socket,data:CTX.post_judge_data){
            debug(this.id)
        })
        socket.on('disconnect', function(this:socket.Socket,reason){
            debug(`${this.id} disconnected.\n\treason : ${reason}`)
        })

    })


    return {
        server,
        nsp:io.sockets
    }
}
