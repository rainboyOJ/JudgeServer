import { createServer } from './app/Koa'
import {createSocket} from './app/Socket'


async function main(){
    try {
        var koa = createServer()
        let {server} =createSocket(koa);



        server.listen(5000,() => {
            console.log('JudgeServer listen at port:',5000)
        })
    }
    catch(e){
    }
}

main()
