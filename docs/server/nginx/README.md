# Nginx安装指南

## 在CentOS7上安装Nginx

Nginx可以直接在不同平台使用[包进行安装](https://nginx.org/en/linux_packages.html)，本文使用[本地安装](https://nginx.org/en/docs/configure.html)。

Nginx需要使用`gcc`在本地编译安装，而且其需要使用相关的依赖来完成本地编译并提供服务，在安装之前需要先检查系统中是否安装相关依赖软件包。所需软件包有：`gcc`、`pcre`、`pcre-devel`、`zlib`、`zlib-devel`、`openssl`、`openssl-devel`

### 1.依赖检查

使用云服务器通常已经安装gcc

```bash
yum list installed | grep "软件名或者包名"
```

### 2.安装依赖

```bash
# 安装gcc，用于编译nginx源码
yum install gcc

# 安装 pcre pcre-devel，nginx 的 http 模块使用 pcre 来解析正则表达式
yum install -y pcre pcre-devel

# 安装zlib，nginx 使用 zlib 对 http 包的内容进行 gzip
yum install -y zlib zlib-devel

# 安装OpenSSL，强大的安全套接字层密码库，nginx 用其支持https
yum install -y openssl openssl-devel
```

### 3.下载nginx源码

可以在[官方下载页面](http://nginx.org/en/download.html)直接下载最新稳定版到本机，然后将其上传至`CentOS`服务器上。(需下载`tar.gz`的文件)

```bash
# 也可以通过命令下载，但要注意安装版本，需在官网自行查看最新版本
wget -c https://nginx.org/download/nginx-1.18.0.tar.gz
```

### 4.安装nginx

安装前需注意nginx压缩包所在的目录，通常是下载或上传到用户目录内的（例如：`/home/nginx/nginx-1.18.0.tar.gz`或`~/nginx-1.18.0.tar.gz`）

按照下述步骤依次执行安装：

```bash
# 解压出nginx源码目录
tar -zxvf nginx-1.18.0.tar.gz

# 进入解压后目录
cd nginx-1.18.0

# 使用默认配置
./configure

# 若需要使用SSL，则需要添加相关安装参数
# 更多安装配置可前往 https://nginx.org/en/docs/configure.html
./configure --with-http_ssl_module

# 编译 构建软件
make

# 安装
make install

# 查找安装路径，默认路径为： /usr/local/nginx
whereis nginx
```

了解`configure`、`make`、`make install`命令，[看这里](https://zhuanlan.zhihu.com/p/77813702)

### 5.启停nginx

nginx的核心执行文件为：`/usr/local/nginx/sbin/nginx`

按需执行下列命令：

```bash
# 进入nginx执行文件目录
cd /usr/local/nginx/sbin

# 启动 nginx
./nginx

# 停止 nginx
./nginx -s stop

# 退出 nginx，等待nginx进程处理完任务再执行停止
./nginx -s quit

# 重新加载文件，修改 nginx.conf 后使用此命令，新配置即可生效
./nginx -s reload

# 重启nginx 先停止，再启动。
./nginx -s stop 
./nginx

# 检查nginx是否启动成功
ps aux|grep nginx
或
ps -ef|grep nginx
```

启动完成后，在浏览器输入服务器ip即可看到nginx提供的默认欢迎页面。

#### 强制停止nginx

若使用`./nginx -s stop`无法停止`nginx`。则可以使用`kill`命令强制停止进程。

```bash
# 从容停止
kill -QUIT 主进程号
# 快速停止
kill -TERM 主进程号
# 强制停止
kill -9 nginx
```

通过`ps aux|grep nginx`或`ps -ef|grep nginx`查看nginx的进程号。

### 6.配置nginx开机自启动

非必须：此配置为可选操作。

```bash
# 在 rc.local 增加自启动代码
vi /etc/rc.local
# 追加下列配置内容并保存
/usr/local/nginx/sbin/nginx
# 设置执行权限
cd /etc
chmod 755 rc.local
```

### 7.配置nginx.conf

[修改nginx默认的配置](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/)以完成对自己站点的访问代理，配置时只用关心`http => server`部分的配置，一个`http`内可以有多个`server`，这样可以实现同端口服务的转发或重定向。

如果应用是运行于服务器内某个端口的服务，可以这样配置，让nginx监听服务的端口，比如nuxt或next的ssr应用需要使用此种配置。

```nginx
http {
  server {
    # listen为监听的端口
    listen       80;
    # server_name为域名
    server_name  www.your-server-ip.com;
    # location是访问地址的设置,locahost也可以用服务器ip代替
    location / {
      proxy_pass http://localhost:8080; 
    }
  }
}
```

若只是代理静态目录，则需在`location`中在`root`配置访问目录，并配置首页文件：

```nginx
http {
  server {
    # listen为监听的端口
    listen       80;
    # server_name为域名
    server_name  www.your-server-ip.com;
    # location是访问地址的设置,locahost也可以用服务器ip代替
    location / {
      root /home/nginx/app;
      index index.html index.htm;
    }
  }
}
```

nginx默认访问路径是`/usr/local/nginx/html`，可以将其替换为其他的当前用户可访问的目录。不能使用`~`方式的路径，可以在完成配置后使用`./nginx -t`来测试配置是否有效。

#### 443端口配置SSL证书

在配置SSL之前，需确定是否为`Nginx`安装了支持ssl的模块。若未安装，则需要先将其[补充安装](nginx补充安装.md)！

1. 下载SSL证书并解压（SSL证书在云服务商证书管理提供下载）；
2. 找到`/Nginx`目录内后缀为`crt`和`key`的两个文件拷贝到服务器`/usr/local/nginx/conf`目录；
3. 可照如下内容配置`nginx.conf`文件的`server`部分

```nginx
server {
    #SSL 访问端口号为 443
    listen 443 ssl; 
    #填写绑定证书的域名
    server_name www.your-server-name.com; 
    #证书文件名称
    ssl_certificate 你的证书.crt; 
    #私钥文件名称
    ssl_certificate_key 你的证书.key; 
    ssl_session_timeout 5m;
    #请按照以下协议配置
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; 
    #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
    ssl_prefer_server_ciphers on;
    location / {
       #网站主页路径。此路径仅供参考，具体请您按照实际目录操作。
        root html; 
        index  index.html index.htm;
    }
}
```

4. 验证配置是否正确；

```bash
/usr/local/nginx/sbin/nginx -t
```

5. 生效配置

方式一：

```bash
/usr/local/nginx/sbin/nginx -s reload
```

方式二：

重启nginx

#### 配置http自动跳转https

Nginx 支持 rewrite 功能。若在编译时没有去掉 pcre，可在 HTTP 的 `server` 中增加 `return 301 https://$host$request_uri;`，即可将默认80端口的请求重定向为 HTTPS。

新增一个server

```nginx
server {
    listen 80;
    #填写绑定证书的域名
    server_name www.你的域名.com; 
    #把http的域名请求转成https
    return 301 https://$host$request_uri; 
}
```

利用nginx此功能，可以将不含`www`的域名访问请求重定向到https上。同样上述配置：

```text
将
server_name www.你的域名.com
改为
server_name 你的域名.com即可。
```

:::tip
如果提供同一资源服务的站，不要同时开设多域名的站点，将域名访问统一。可集中搜索引擎权重，利于SEO！
:::
