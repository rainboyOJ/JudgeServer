//运行cpu核心数量-1 进程的worker
const numCPUs = require('os').cpus().length;
import * as cluster from "cluster"

import worker from "./worker"

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);

    // 衍生工作进程。
    for (let i = 0; i < Math.max(1,numCPUs-1); i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`========================== 工作进程 ${worker.process.pid} 已退出`);
    });

} else {
    worker();
    console.log(`工作进程 ${process.pid} 已启动`);
}
