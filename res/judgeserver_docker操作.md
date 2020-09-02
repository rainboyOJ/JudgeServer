- 源

```
cp ./res/source.list /et/apt/source.list
apt update
```

- 安装相应的软件 

```
RUN buildDeps='software-properties-common curl git libtool cmake python-dev python3-pip python-pip libseccomp-dev' && \
    apt update && apt install -y python python3.5 python-pkg-resources python3-pkg-resources gcc g++ $buildDeps && \
    add-apt-repository ppa:openjdk-r/ppa && apt update && apt install -y openjdk-8-jdk && \
    pip3 install --no-cache-dir psutil gunicorn flask requests && \
    cd /tmp && git clone -b newnew  --depth 1 https://github.com/QingdaoU/Judger && cd Judger && \
    mkdir build && cd build && cmake .. && make && make install && cd ../bindings/Python && python3 setup.py install && \
    apt purge -y --auto-remove $buildDeps && \
    apt clean && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /code && \
    useradd -u 12001 compiler && useradd -u 12002 code && useradd -u 12003 spj && usermod -a -G code spj
```

- 安装 nodejs

```
wget -O nodejs.tar.xz https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz
cp -r node-v*/* /usr/
rm -rf node-v*
```

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install -y nodejs
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt install yarn
yarn config set registry https://registry.npm.taobao.org
```

```
docker build -t judgeServer:0.1
```
