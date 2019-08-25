import debug from 'debug'

class mydebug {
    debug: debug.Debugger
    detail: debug.Debugger
    __line : any
    constructor(){
        this.debug = debug('debug')
        this.detail = debug('detail')

        var self = this
        // 来自 https://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js
        Object.defineProperty(this, '__stack', {
            get: function(){
                var orig = Error.prepareStackTrace;
                Error.prepareStackTrace = function(_, stack){ return stack; };
                var err = new Error;
                Error.captureStackTrace(err, arguments.callee);
                var stack = err.stack;
                Error.prepareStackTrace = orig;
                return stack;
            }
        });
        
        Object.defineProperty(self, '__line', {
            get: function(){
                //@ts-ignore
                return self.__stack[1].getLineNumber();
            }
        });

    }
}


export default new mydebug()
