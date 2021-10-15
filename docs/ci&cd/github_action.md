# Github Actions自动构建部署到云

travis ci是一款优秀的持续集成和部署工具，但令人遗憾的是，它开始转向收费模式。新用户会给10000积分(Linux上1分钟=10积分)的构建用时，用完后就需要进行付费购买，虽然官方说可以发送邮件免费获取，但这有点过于麻烦了。我们应该支持付费，毕竟别人提供服务也需要资金支持运营，不过对于个人开源项目本身使用量不大的情况只给10000有些不太够用！

但另一个让人高兴地消息是Github也开始（2018年起）提供CI/CD服务(Github Actions)，不仅如此，开源项目他是免费的！即使是私有仓库他也提供每月2000分钟的使用支持！

## Github Actions入门

Github Actions上手较为简单，推荐阅读[阮一峰GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

## 环境准备

1. Github账号和一个用于自动构建的库；
2. 一台安装CentOS的云服务器；
3. SSH连接工具PuTTY、SecureCRT或其他SSH连接工具，主要用于密钥文件的上传；

## 配置免密登录服务器

在Github Actions上配置和执行打包过程并不会出现太多问题，主要需要解决的是如何免密登录服务器。关于如何免密登录服务器可以参考我的这篇文章[Travis CI自动构建部署到云](/ci&cd/travis.html#_2-配置免密远程登录服务器)，可能会遇到的问题你也能在此文中找到答案。

需要注意的是，不用再需要按照内容提示使用本地Linux环境，那是为了给Travis CI工具提供支持使用！但若你喜欢并要使用GitHub本地命令行工具的话，我依然建议在Linux环境中使用，这样可以尽量避免在windows环境下不必要的问题发生！

完成秘钥的创建并在本地实现免密登录后，则需要将`id_rsa`内的内容完整复制到Github仓库秘钥存储库中，作用是给接下来在actions中实现自动登录提供支持。如图：（图片存于sm.ms，若无法正常显示，需要翻墙）

![secrets.png](https://i.loli.net/2021/10/15/quSvaQe3NhljBTd.png)

这个秘钥库的作用是以键值对的方式存储不想暴露的机密内容，当我们在`workflow`配置文件（.yml文件）中引用key时，脚本过程会自动将值填入，但不会明文显示！

## 配置文件解读

```yml
# 给部署脚本起名
name: deploy blog

# Controls when the workflow will run
on:
  # 脚本将只在 main 分支 被 push 时触发
  push:
    branches: [ main ]

# 执行工作流程的脚本
jobs:
  # 脚本名叫 build
  build:
    # 运行于哪个系统
    runs-on: ubuntu-latest

    # 依次执行的命令
    steps:
      # 使用github官方提供的action,checkout项目到虚拟机上
      - uses: actions/checkout@v2
      # 使用版本为12的nodejs
      - uses: actions/setup-node@v2
        with:
          node-version: '12'
      
      # 安装项目依赖
      - name: install dependencies
        run: yarn install
      # 执行构建  
      - name: build
        run: yarn build
      
      # 使用 wlixcc 开源项目 SFTP-Deploy-Action 进行远程文件拷贝
      - name: SFTP Deploy
        uses: wlixcc/SFTP-Deploy-Action@v1.2.1
        # 配置插件action所需服务器信息参数
        with:
          username: '${{ secrets.SERVER_NAME }}'
          server: '${{ secrets.SERVER_IP }}'
          ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
          local_path: './docs/.vuepress/dist/*'
          remote_path: '/usr/local/nginx/html/blog'
          args: '-o StrictHostKeyChecking=no'
```

若有多分支或不同部署环境需求，还可以利用`if`进行分支判断：

```yml{24,34}
name: Multi-branch deployment
on: 
  push:
    branches:
      - master # 当master分支推送的时候,部署到生产服务器
      - test # 当test分支推送的时候,部署到测试服务器

jobs:
  deploy_job:
    runs-on: ubuntu-latest
    
    name: build&deploy
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      # 安装依赖
      - name: Install Dependencies 
        run: yarn
      # 构建
      - name: build  
        run:  yarn build
      # 部署到测试环境
      - name: deploy file to test server
        if: github.ref == 'refs/heads/test' #对分支进行检测
        uses: wlixcc/SFTP-Deploy-Action@v1.0
        with:
          username: 'server username'
          server: '${{ secrets.TEST_SERVER_IP }}' #测试服务器地址
          ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
          local_path: '打包结果目录'
          remote_path: '远程部署目录' #测试服务器部署路径
      # 部署到生产环境
      - name: deploy file to prod server
        if: github.ref == 'refs/heads/master' #对分支进行检测
        uses: wlixcc/SFTP-Deploy-Action@v1.0
        with:
          username: 'server username'
          server: '${{ secrets.SERVER_IP }}' #正式服务器地址
          ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
          local_path: '打包结果目录'
          remote_path: '远程部署目录' #服务器部署路径
```

## 如何实现的远程文件拷贝

上一篇[Travis CI自动构建部署到云](/ci&cd/travis.html#_2-配置免密远程登录服务器)中介绍到，想要实现不暴露私钥文件需要借助`travis ci`工具加密`id_rsa`私钥文件并随项目上传，然后`travis`在构建时会依据在`before_install`生成的关于`openssl`命令来解密并释放出`id_rsa`文件。

那`SFTP-Deploy-Action`是如何实现的`id_rsa`文件的获取呢？还记得上面说到将与服务器通信的`id_rsa`文件内容保存到仓库的`secrets`中吗？构建过程中，`action`会将`SSH_PRIVATE_KEY`（这个名字是自己创建时定义的）的值拷贝到环境中，而`SFTP-Deploy-Action`将这个值获取并通过`shell`命令释放到`docker`环境的某个文件（`../private_key.pem`）中，然后通过`ssh -i`和`scp -i`命令指定登录秘钥文件来实现远程登录和拷贝动作。

注意：有可能会遇到`Load key "../private_key.pem": invalid format`的错误，原因可能是1.名称写错；2.确实是拷贝`id_rsa`时格式错误，建议使用shell通过`cat`名称输出到控制台后复制。

这里的`private_key.pem`文件就是我们生成的`id_rsa`私钥文件，在意义上它们相似又不完全相同，感兴趣的朋友可以查阅资料深入了解一下。

参考资料：[在工作流程中使用加密密码](https://docs.github.com/cn/actions/security-guides/encrypted-secrets#using-encrypted-secrets-in-a-workflow)、[SCP命令配置项](https://wangdoc.com/ssh/scp.html#%E9%85%8D%E7%BD%AE%E9%A1%B9)、[sshd 的命令行配置项](https://wangdoc.com/ssh/server.html#sshd-%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%E9%85%8D%E7%BD%AE%E9%A1%B9)

## 深入SFTP-Deploy-Action源码

现在我们深入一下`SFTP-Deploy-Action`源码来了解一下关于`Github Actions`更多内容！

```yml
# action.yml
name: 'SFTP Deploy'
description: 'Deploy file to your server use sftp & ssh private key'
inputs:
  username:
    description: 'username'
    required: true
  server:  
    description: 'your sftp server'
    required: true
  port: 
    description: 'your sftp server port, default to 22'
    required: true
    default: "22"
  ssh_private_key:
    description: 'you can copy private_key from your *.pem file, keep format'
    required: true
  local_path:
    description: 'will put all file under this path'
    required: true
    default: ./*
  remote_path:
    description: 'files will copy to under remote_path'
    required: true
    default: /
  args:
    description: 'sftp args'
    required: false

runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.username }}
    - ${{ inputs.server }}
    - ${{ inputs.port }}
    - ${{ inputs.ssh_private_key }}
    - ${{ inputs.local_path }}
    - ${{ inputs.remote_path }}
    - ${{ inputs.args }}

branding:
  icon: 'upload-cloud'  
  color: 'purple'
```

我们在使用`SFTP-Deploy-Action`时需要提供关于服务器的参数，会用到[with](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepswith)属性，它本身是和[inputs](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs)关联使用的，[inputs](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs)定义的参数需要用[with](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepswith)来接收。

然后通过[runs](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runs-for-docker-actions)使用`Dockerfile`指定`.sh`运行脚本并将获得的参数传给`docker`环境。

```shell
# 通过 Dockerfile 指定运行的 entrypoint.sh 文件
#!/bin/sh -l

#set -e at the top of your script will make the script exit with an error whenever an error occurs (and is not explicitly handled)
set -eu

# 指定释放到的文件
TEMP_SSH_PRIVATE_KEY_FILE='../private_key.pem'
TEMP_SFTP_FILE='../sftp'

# shell printf 指令可以将内容不打印到控制台直接输出到文件中
printf "%s" "$4" >$TEMP_SSH_PRIVATE_KEY_FILE
# 设置权限，避免因权限而无法连接
chmod 600 $TEMP_SSH_PRIVATE_KEY_FILE

echo 'ssh start'

# 使用 ssh 和私钥文件远程连接服务器，并使用 mkdir -p 确保目标目录存在
ssh -o StrictHostKeyChecking=no -p $3 -i $TEMP_SSH_PRIVATE_KEY_FILE $1@$2 mkdir -p $6

echo 'sftp start'
# 将参5、参6拼接起来输出到 ../sftp 文件中，put -r 命令作用是进行文件传输
printf "%s" "put -r $5 $6" >$TEMP_SFTP_FILE
# -b 指定运行命令的文件
# -o StrictHostKeyChecking=no avoid Host key verification failed.这里指定了StrictHostKeyChecking就不用我们自己传了
sftp -b $TEMP_SFTP_FILE -P $3 $7 -o StrictHostKeyChecking=no -i $TEMP_SSH_PRIVATE_KEY_FILE $1@$2

echo 'deploy success'
exit 0
```

文件中出现的`$`+数字指的是使用第几个参数。

结合[Travis CI自动构建部署到云](/ci&cd/travis.html#_2-配置免密远程登录服务器)来看，`Github Actions`与之一样都需要使用`秘钥`文件来实现免密连接。但`Github Actions`的优势在于不用使用加密工具进行私钥加密，因为平台一致性，直接使用`环境变量`即可获取私钥文件。另一点是`Github Actions`可以使用别人写好的`action`来帮助我们的部署，减少花在部署配置上的时间，不用完全吃透所有配置也能完成一些任务，这一点比`travis`强很多！

参考资料：[SCP命令配置项](https://wangdoc.com/ssh/scp.html#%E9%85%8D%E7%BD%AE%E9%A1%B9)、[sshd 的命令行配置项](https://wangdoc.com/ssh/server.html#sshd-%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%E9%85%8D%E7%BD%AE%E9%A1%B9)、[SFTP命令行配置项](https://learn.akamai.com/en-us/webhelp/netstorage/netstorage-user-guide/GUID-E0B5C44E-7618-4C41-B9AB-186CF3E28628.html)
