# Travis CI自动构建部署到云服务器

[Travis CI](https://www.travis-ci.com/)是一款可以帮助我们实现CI/CD的工具。但当前情况下，它暂时只与Github的项目的协作最为友好，其他平台官方也在适配中。根据官方的部署案例，可以便捷地[部署到github pages上](https://docs.travis-ci.com/user/deployment/pages/)，但若是需要部署到自己的服务器，就需要一定的摸索了！因为官方没有相关文档介绍。

## 环境准备

1. Github账号和公开仓库，私有仓库是收费的；
2. 访问[travis-ci.com](https://www.travis-ci.com/)，使用Github账号登录，根据提示绑定需要被监听的代码仓库；
3. 一台安装CentOS的云服务器，我使用的是CentOS7；
4. 本地使用虚拟机或wsl安装Linux系统，使用较为常用的发行版，和云服务器系统一致较好。我使用的是虚拟机安装的ubuntu系统；
5. SSH连接工具PuTTY、SecureCRT或其他SSH连接工具，主要用于密钥文件的上传；

## 自动化部署流程概览

1. 本地对项目的修改并提交；
2. Travis监听到仓库的改变；
3. Travis启动构建任务，根据任务生命周期执行对应任务（例如`install`和`script`执行安装和构建脚本命令）；
4. 完成构建任务后，在`after_success`生命周期任务中，使用ssh免密登录服务器；
5. 使用scp命令拷贝项目文件到部署位置，若需要启停项目则还需执行任务脚本；
6. 完成部署；

## 1.配置".travis.yml"文件

有了此文件，`travis`才能知道如何编译当前项目和执行相关命令脚本。

这是我部署时的完整配置文件，不熟悉的话请别紧张，我会一一解释相关内容！

```yml
# 运行环境
language: node_js
# 指定node版本
node_js:
- '12'
# 使用缓存目录，可以加快构建速度
cache:
  directories:
  - node_modules
# 只监听main分支
branchs:
  only:
  - main
# 避免免密ssh登录时询问将ip添加到known_hosts，询问过程是交互式的，无法输入
addons:
  ssh_known_hosts: ${SERVER_IP}
# 执行构建前执行的命令
before_install:
- openssl aes-256-cbc -K $encrypted_d0435390278d_key -iv $encrypted_d0435390278d_iv
  -in id_rsa_blog.enc -out ~/.ssh/id_rsa_blog -d
- chmod 700 ~
- chmod 700 ~/.ssh
- chmod 600 ~/.ssh/id_rsa_blog
- echo -e "Host ${SERVER_IP}\nUser root\nStrictHostKeyChecking no\nIdentityFile ~/.ssh/id_rsa_blog" > ~/.ssh/config
- chmod 600 ~/.ssh/config
- cat ~/.ssh/config
- yarn global add vuepress@next
# 安装项目所需依赖
install:
- yarn install
# 执行构建命令
script:
- yarn build
# 构建完成后，拷贝目标文件到服务器
after_success:
- cd docs/.vuepress/dist
- scp -o stricthostkeychecking=no -r ./* ${SERVER_NAME}@${SERVER_IP}:/usr/local/nginx/html/blog
```

上述配置`before_install`中有这一段命令：

```yml
before_install:
- openssl aes-256-cbc -K $encrypted_d0435390278d_key -iv $encrypted_d0435390278d_iv
  -in id_rsa_blog.enc -out ~/.ssh/id_rsa_blog -d
```

这并不是我们自己手动写上去的，而是为了实现ssh免密登录在本地使用`travis`工具自动创建的！

## 2.配置免密远程登录服务器

ssh免密登录的基本过程：

1. 在本地通过`ssh-keygen`命令生成公私钥对，然后将生成的后缀为`.pub`（默认为id_rsa.pub）的文件复制一份将名称修改为`authrized_keys`上传至云服务器的`~/.ssh`目录（若本身就有这份文件，则需将内容追加至`authrized_keys`内）
2. 在本地的`~/.ssh`内创建名为`config`的文件，将以下内容填入其中：

```text
Host 你的服务器IP或域名
User 登录服务器的用户名 # 可以不填
StrictHostKeyChecking no # 禁用首次访问安全检查，不提示输入密码
IdentityFile /home/hi/.ssh/id_rsa_blog # 指定密钥验证文件
```

完成以上两步，基本完成免密配置，此时可以在本地通过`ssh 你的ip`连接到云服务器。如果想要不输入`用户名@ip`，则需要在`config`配置`User`项，否则登录时默认以本机用户名来登录，此时登录会出错，需要写全用户名和ip地址才行，因此最好是配置`User`项。

