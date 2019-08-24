import * as Client from 'socket.io-client'

const client = Client("http://127.0.0.1:5000?token=token")

client.on('connect',()=>{
    console.log('connected!')
})

client.emit("message","hello")
