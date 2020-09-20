#!/bin/bash

# 启动程序
redis-server /etc/redis/redis.conf
# rsync
ip=$(ip addr show  | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
rsync --address=$ip --port=873 --config=/JudgeServer/config/rsync.conf --daemon
core=$(expr $(nproc) - 1)
if [ $core == 0 ]; then
    core=1
fi
./node_modules/.bin/pm2 start dist/worker.js -i $core
/usr/bin/node dist/app.js
#/usr/bin/node dist/multi_workers.js
