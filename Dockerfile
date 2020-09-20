FROM ubuntu:16.04
#COPY res/source.list /etc/apt/source.list
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list && sed -i '/security/d' /etc/apt/sources.list
#RUN sed -i 's/archive.ubuntu.com/cn.archive.ubuntu.com/g' /etc/apt/sources.list && sed -i 's/security.ubuntu/cn.archive.ubuntu/g' /etc/apt/sources.list
RUN buildDeps='software-properties-common curl git libtool cmake python-dev python3-pip python-pip libseccomp-dev rsync' && \
    apt update && apt install -y python python3 python-pkg-resources python3-pkg-resources gcc redis-server g++ $buildDeps
RUN apt install -y apt-transport-https
#安装 testlib judger
RUN apt install -y wget xz-utils && \
    wget -O nodejs.tar.xz https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz && \
    tar -xvf node* && \
    cp -r node-v*/* /usr/ && \
    rm -rf node*
RUN npm config set registry http://registry.npm.taobao.org/ && \
    apt purge -y --auto-remove $buildDeps && \
    apt clean && rm -rf /var/lib/apt/lists/* && \
    mkdir /JudgeServer &&  useradd -u 12001 compiler && useradd -u 12002 code && useradd -u 12003 spj && usermod -a -G code spj
# 创建相应的目录 与 数据
#RUN git clone --depth=1 https://github.com/rainboyOJ/JudgeServer /JudgeServer && cd /JudgeServer && git submodule init && git submodule update
ADD . /JudgeServer
WORKDIR /JudgeServer
RUN git submodule init && git submodule update && \
    mkdir -p /data && cp -r /JudgeServer/demo/data/a+b /data/ && \
    chown root:root /JudgeServer/config/images.pas && \
    chmod 600 /JudgeServer/config/images.pas
# 安装相应的judger 与testlib
RUN npm install yarn -g && yarn config set registry https://registry.npm.taobao.org && \
    yarn && yarn build && \
    cd testlib && ./install.sh && \
    cd ../Judger && mkdir build && cd build && cmake .. && make && make install && \
    cd ../bindings/NodeJS && yarn
EXPOSE 5000
EXPOSE 873
ENTRYPOINT ["/JudgeServer/entrypoint.sh"]
