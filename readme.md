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


## spj

可以使用默认的testlib的spj

也可以的数据目录文件夹内,放入

 - spj.cpp
 - spj.py
 - spj.js

## 安装

### docker

```
docker build --network=host -t judgerserver
```
