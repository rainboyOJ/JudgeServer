import * as socket from 'socket.io'
import * as Koa from 'koa'
import * as http from 'http'

export const createSocket = (app:Koa) => {
    const server = http.createServer(app.callback())
    const io = socket(server)
    
    io.on('connection', function(socket){

        socket.on('message',function(this:socket.Socket,msg){
            console.log(this.id)
            console.log(msg)
        })
    })

    return {
        server
    }
}
