#!/bin/bash

# 启动程序
redis-server /etc/redis/redis.conf
# rsync
chown root:root /JudgeServer/config/images.pas
ip=$(ip addr show  | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
rsync --address=$ip --port=873 --config=/JudgeServer/config/rsync.conf --daemon
#core=$(grep --count ^processor /proc/cpuinfo)
#n=$(($core*2))
#exec gunicorn --workers $n --threads $n --error-logfile /log/gunicorn.log --time 600 --bind 0.0.0.0:8080 server:app
/usr/bin/node dist/app.js &
/usr/bin/node dist/multi_workers.js
