import { createServer } from './app/Koa'


async function main(){
    try {
        var koa = createServer()

        koa.listen(5000,() => {
            console.log('JudgeServer listen at port:',5000)
        })
    }
    catch(e){
    }
}

main()
