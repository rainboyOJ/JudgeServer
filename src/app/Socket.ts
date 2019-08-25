import * as socket from 'socket.io'
import * as Koa from 'koa'
import * as http from 'http'
import debug from '../lib/debug'
import config from '../lib/CONFIG'
import Redis from './Redis'


export const createSocket = (app:Koa) => {
    const server = http.createServer(app.callback())
    const io = socket(server)

    io.use((socket, next) => {
        let {query:{token}}= socket.handshake;
        let {TOKEN} = <CONFIG>config.get_config()
        if( token == TOKEN){
            next()
        } else {
            console.error(`close ${socket.id} connection, \n\t reason: invalid token`)
            debug(` query token: ${token}\n config token: ${TOKEN}`)
            socket.disconnect()
        }
    });

    
    io.on('connection', function(socket){
        debug(`${socket.id} connected!`)

        /**  */
        socket.on('judge',function(this:socket.Socket,data:CTX.post_judge_data){
            debug(this.id)
            debug(data)

            //todo
            // check data format

            Redis.compile_push({
                post_judge_data:data,
                config:{
                    type:'compile',
                    socket_client_id:this.id
                }
            }).then( function(){
                debug(`数据加入到 compile_queue`)
            })
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
