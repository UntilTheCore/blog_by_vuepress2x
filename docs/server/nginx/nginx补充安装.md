# Nginx补充安装

当使用源码安装时，只使用`./configure`不添加任何参数，会造成一些可能需要的服务无法使用。比如未安装支持SSL的模块，即使配置监听了443端口，也会在运行时报如下错误：

```text
Nginx: [emerg] the "ssl" parameter requires ngx_http_ssl_module in /usr/local/nginx/conf/nginx.conf
```

> 本文以补充安装SSL相关模块展开介绍

## 获取新的nginx执行文件

```bash
# 首先进入之前安装的源码目录内
cd /home/nginx/nginx-1.18.0

# 配置 SSL 相关模块
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module

# 执行编译
make
```

:::tip
可以通过`/usr/local/nginx/sbin/nginx -V`查看返回结果的`configure arguments`内是否有配置相关参数。
:::

:::warning
执行make后无需`make install`，否则会覆盖旧的安装，影响`nginx.conf`等配置文件，除非你明确需要进行覆盖安装。
:::

## 停止已运行的`Nginx`服务

```bash
/usr/local/nginx/sbin/nginx -s stop
```

如果无法通过此上述终止nginx，可以使用`kill -9 nginx`强制终止运行。

## 覆盖旧的nginx执行文件

```bash
cp /home/nginx/nginx-1.18.0/obj/nginx /usr/local/nginx/sbin/
```

此命令为将新编译出的nginx执行文件将旧的覆盖。执行过程中会询问是否覆盖，输入`yes`回车即可。

执行完成后，使用`-V`命令查看参数配置是否生效：

```bash
/usr/local/nginx/sbin/nginx -V
```

返回信息的`configure arguments`中与我们重新编译时配置的参数一致。

## 重启运行Nginx

```bash
/usr/local/nginx/sbin/nginx
```

更多安装配置参数，请参阅[官方参数配置文档](https://nginx.org/en/docs/configure.html)
