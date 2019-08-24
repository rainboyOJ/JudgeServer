import * as socket from 'socket.io'
import * as Koa from 'koa'
import * as http from 'http'


export const createSocket = (app:Koa) => {
    const server = http.createServer(app.callback())
    const io = socket(server)

    
    io.on('connection', function(socket){

        /**  */
        socket.on('judge',function(this:socket.Socket,data:CTX.post_judge_data){
            console.log(this.id)
        })

        socket.on('connection',function(){
        })
    })

    return {
        server,
        nsp:io.sockets
    }
}
