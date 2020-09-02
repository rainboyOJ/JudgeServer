FROM ubuntu:16.04
#COPY res/source.list /etc/apt/source.list
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list && sed -i '/security/d' /etc/apt/sources.list
#RUN sed -i 's/archive.ubuntu.com/cn.archive.ubuntu.com/g' /etc/apt/sources.list && sed -i 's/security.ubuntu/cn.archive.ubuntu/g' /etc/apt/sources.list
RUN buildDeps='software-properties-common curl git libtool cmake python-dev python3-pip python-pip libseccomp-dev' && \
    apt update && apt install -y python python3.5 python-pkg-resources python3-pkg-resources gcc redis-server g++ $buildDeps
RUN apt install -y apt-transport-https
#安装 testlib judger
RUN apt install -y wget xz-utils && \
    wget -O nodejs.tar.xz https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz && \
    tar -xvf node* && \
    cp -r node-v*/* /usr/ && \
    rm -rf node*
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt update && \
    apt install -y yarn && yarn config set registry https://registry.npm.taobao.org && \
    #apt purge -y --auto-remove $buildDeps && \
    apt clean && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /code && cp -r /judgeserver/demo/data / \
    useradd -u 12001 compiler && useradd -u 12002 code && useradd -u 12003 spj && usermod -a -G code spj
# 创建相应的目录 与 数据
RUN mkdir -p /data
# redis-server 后台启动
