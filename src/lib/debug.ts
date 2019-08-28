import debug from 'debug'
import {basename} from 'path'


class mydebug {
    DEBUG: debug.Debugger
    DETAIL: debug.Debugger
    private STACK_FRAME_RE:RegExp
    private THIS_FILE:string
    constructor(){
        this.DEBUG = debug('debug')
        this.DETAIL = debug('detail')
        this.STACK_FRAME_RE = new RegExp(/at ((\S+)\s)?\(?([^:]+):(\d+):(\d+)/);
        this.THIS_FILE = __filename.split('/')[__filename.split('/').length - 1];

        // 来自 https://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js
        
        //Object.defineProperty(self, '__line', {
        //});
    }

    info(msg:any){
        this.DEBUG(msg)
    }

    debug(msg:any){
        let callerInfo = this._getCaller() || {}
        //@ts-ignore
        this.DEBUG(`===== module :[${callerInfo.module}] \n`, `===== function :[${callerInfo.function}] \n`,`===== line: [${callerInfo.line}] \n`, msg)
    }
    detail(msg:any){
        let callerInfo = this._getCaller() || {}
        //@ts-ignore
        this.DETAIL(callerInfo.module, callerInfo.function, callerInfo.line, msg,)
    }

    //https://gist.github.com/jedp/3166317
    _getCaller() {
        var err = new Error();
        Error.captureStackTrace(err);

        // Throw away the first line of the trace
        // @ts-ignore
        var frames = err.stack.split('\n').slice(1);

        // Find the first line in the stack that doesn't name this module.
        var callerInfo = null;
        for (var i = 0; i < frames.length; i++) {
            if (frames[i].indexOf(this.THIS_FILE) === -1) {
                callerInfo = this.STACK_FRAME_RE.exec(frames[i]);
                break;
            }
        }
        if (callerInfo) {
            return {
                function: callerInfo[2] || null,
                module: callerInfo[3] ? basename(callerInfo[3]): null,
                line: callerInfo[4] || null,
                column: callerInfo[5] || null
            };
        }
        return null;
    }
}


export default new mydebug()
