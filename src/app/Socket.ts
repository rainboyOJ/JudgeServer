import * as socket from 'socket.io'
import * as Koa from 'koa'
import * as http from 'http'
import debug from '../lib/debug'
import config from '../lib/CONFIG'
import Redis from './Redis'
import get_lang_ext from '../lib/get_lang_ext'
import {CTX,CONFIG} from '../types/global'

function check_post_judge_data(data:CTX.post_judge_data):CTX.post_judge_data{
    /** 是否缺少 */
    let default_args  = config.get_config()['DEFAULT_POST_JUDGE_ARGS'];

    let args = {...default_args,...data}
    
    if( !args.code || args.code.length < 50){
        throw('没有提交代码,或代码长度不够(>50)')
    }

    if( !args.auto_io  && (!args.file_in || !args.file_out )){
        throw('auto_io为false时,file_in,file_out必须指明')
    }

    /** 检查是不是 支持的语言 */
    get_lang_ext(args.lang)

    return args;
}


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
            debug.debug(` query token: ${token}\n config token: ${TOKEN}`)
            socket.disconnect()
        }
    });

    
    io.on('connection', function(socket){
        debug.debug(`${socket.id} connected!`)
        
        /**  */
        socket.on('judge',function(this:socket.Socket,data:CTX.post_judge_data){
            debug.detail(this.id)
            debug.detail(data)

            //todo
            // check data format
            let checked_data:CTX.post_judge_data
            try{
                checked_data = check_post_judge_data(data)
                debug.debug("======== post_judge_data Checked OK!")
                //debug.debug(checked_data);
                //debug.debug(JSON.stringify(checked_data,null,3));
            }
            catch(e){
                Redis.PUBLISH_MESSAGE({
                    socket_client_id:<string>this.id,
                    result:-1,
                    message:e.message || e,
                    result_list:[]
                });
                return;
            }

            Redis.compile_push({
                post_judge_data:checked_data,
                method:'GET',
                path:'/compile',
                config:{
                    type:'compile',
                    socket_client_id:this.id
                },
                data:{raw_list:[],list:[],list_for_auto_io:[],
                    dataYML:{
                        subtasks:[ { score:100, type:'sum', case:[] } ],
                        inputFile:'',
                        outputFile:''
                    }
                }
            }).then( function(){
                debug.debug(`数据加入到 compile_queue`)
            })
        })

        socket.on('disconnect', function(this:socket.Socket,reason){
            debug.debug(`${this.id} disconnected.\n\treason : ${reason}`)
        })

    })


    return {
        server,
        nsp:io.sockets
    }
}
