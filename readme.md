# JudgeServer


## 使用

```
git clone https://github.com/wariii-online-judge/JudgeServer.git
cd JudgeServer
git submodule init
git submodule update
cd testlib
./install.sh
cd ..
npm run build_all
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
