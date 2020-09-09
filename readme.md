# JudgeServer


Document:  https://rainboyoj.github.io/JudgeServer/


## 使用

```
git clone https://github.com/wariii-online-judge/JudgeServer.git
cd JudgeServer
git submodule init
git submodule update

```

安装testlib
```
cd testlib
./install.sh
cd ..
```

安装Judger

```
cd Judger
mkdir build && cd build
cmake .. && make && sudo make install
cd ../bindings/NodeJS/
npm run build
```

```
cp config_default.yaml config.yaml
# change config.yaml
npm run start
```
## 本评测机不支持子任务与交互

## spj

可以使用默认的testlib的spj

也可以的数据目录文件夹内,放入

 - spj.cpp
 - spj.py
 - spj.js

三种格式的测试文件,spj如果指定为`INNER`,侧按顺序去查找,也可以直接指定spj=spj.py

## 安装

### docker

安装docker,并使用加速器
```
docker build --network=host -t judgeserver .
```

测试

```
#docker run -it -v <path_to_localjudge>:/judgeserver judgeserver /bin/bash
#docker run -d -v <path_to_localData>:/data judgeserver 
```

内部集成了rsync来同步数据文件



返回值

```json
{
     "result": 0,
     "message": "OK",
     "result_list": [
         {
             "real_time": 5,
             "memory": 1437696,
             "signal": 0,
             "exit_code": 0,
             "error": 0,
             "result": 0
         }
         ...
     ]
}
```

result_list里的result的含义

| 值 | 含义                    |
|----|-------------------------|
| -1 | 答案错误                |
| 0  | 正确                    |
| 1  | cpu_time_limit 时间超时 |
| 2  | real_time 超时          |
| 3  | 内存超限制              |
| 4  | 运行时错误              |
| 5  | 系统错误                |
| 6  | spj运行时错误           |



```JSON
{
    result:'compile_error', |'compile_spj_error'
    message: 错误原因
}
```


```JSON
{
    result: -1,// 其它错误
    message: 错误原因
}
```
