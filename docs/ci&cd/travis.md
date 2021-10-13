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
- chmod 700 ~ # 保证文件访问权限
- chmod 700 ~/.ssh # 保证文件访问权限
- chmod 600 ~/.ssh/id_rsa_blog # 保证文件访问权限
- echo -e "Host ${SERVER_IP}\nUser root\nStrictHostKeyChecking no\nIdentityFile ~/.ssh/id_rsa_blog" > ~/.ssh/config
- chmod 600 ~/.ssh/config
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

这并不是我们自己手动写上去的，而是为了实现ssh免密登录在本地使用`travis`工具自动创建的！具体请看下文[加密私钥（id_rsa）文件](/ci&cd/travis.html#_3-加密私钥-id-rsa-文件)

## 2.配置免密远程登录服务器

:::tip
请务必在虚拟机上也完成同等配置，这样方便后续使用travis工具。
:::

### ssh免密登录的基本过程

1. 在本地通过`ssh-keygen`命令生成公私钥对，然后将生成的后缀为`.pub`（默认为id_rsa.pub）的文件复制一份将名称修改为`authrized_keys`上传至云服务器的`~/.ssh`目录（若本身就有这份文件，则需将内容追加至`authrized_keys`内）
2. 在本地的`~/.ssh`内创建名为`config`的文件，将以下内容填入其中：

```text
Host 你的服务器IP或域名
User 登录服务器的用户名 # 可以不填
StrictHostKeyChecking no # 禁用主机公钥确认检查，不再有交互式询问过程
IdentityFile /home/hi/.ssh/id_rsa # 指定密钥验证文件，如果修改了秘钥名称，则使用改名后的私钥
```

[了解StrictHostKeyChecking](https://www.cnblogs.com/aspirant/p/10654041.html)

完成以上两步，基本完成免密配置，此时可以在本地通过`ssh 你的ip`连接到云服务器。如果想要不输入`用户名@ip`，则需要在`config`配置`User`项，否则登录时默认以本机用户名来登录。

```bash
# 假如本地机的用户名为admin，登录时会变成
admin@xxx.xx.xx.xxx
```

由于用户名错误，此时登录会出错，需要写全用户名和ip地址才行，因此最好是配置`User`项。

正如上面所说，我们已经基本完成免密配置了。但这个免密是基于第一次用密码登录以后的访问不再需要密码。如果是首次访问，依然会被提示输入登录密码！

那么要怎样才能真正实现无密码访问呢？玄机在服务器的`/etc/ssh/sshd_config`的配置上。

```bash
# /etc/ssh/sshd_config
# 既然已经对ssh配置了使用公私钥的方式登录，那么可以直接禁止使用密码登录服务器。
PasswordAuthentication no
# 启用公钥验证
PubkeyAuthentication yes
# 如果登录的用户是root的话，必须开启这项
PermitRootLogin yes
```

### 出现Permission Denied (publickey,gssapi-keyex,gssapi-with-mic)

如果登录时出现`Permission Denied (publickey,gssapi-keyex,gssapi-with-mic)`则注释掉这两项配置：

```bash
#GSSAPIAuthentication yes
#GSSAPICleanupCredentials no
```

另外，请确保UsePAM的设置为 yes:

```bash
# 这项在云服务器中通常都为 yes
UsePAM yes
```

请特别注意服务器上`~/.ssh`目录及其内部文件的权限问题，登录用户需要拥有正确的权限才能使得远程连接有效。出现错误权限的原因为`.ssh`目录以及内部文件并非当前用户执行`ssh-keygen`生成，而是通过其他途径产生！（拷贝、其他用户的文件）

```shell
# 设置当前用户对 .ssh 文件权限为可读可写可执行
chmod 700 ~/.ssh
# 设置当前用户对 .ssh 内的所有文件权限为可读可写
chmod 600 ~/.ssh/* 
```

### 出现Bad owner or permissions on .ssh/config

出现此问题的原因是本地的`~/.ssh/config`文件的权限不够，当前登录用户需要对此文件有读写权限才行：

```shell
chmod 600 ~/.ssh/config
```

### 出现Permission denied (publickey).

正常情况下，使用`ssh-keygen`生成的秘钥名称是`id_rsa`和`id_rsa.pub`。而在我们生成秘钥的过程中手动指定了新的名称，比如`id_rsa_blog`、`id_rsa_blog.pub`，此时在远程登录时，ssh默认会寻找`id_rsa`来进行私钥匹配，但是本地找不到这个文件，于是登录失败！

如若我们更改了默认秘钥名称，则需要指定访问某个ip时的私钥文件位置。而配置的文件为`~/.ssh/config`，这也是上述免密配置中让主动配置`config`文件的原因。

回顾上文`配置.travis.yml文件`中，我在`before_install`生命周期中添加了这行命令：

```yml
before_install:
- echo -e "Host ${SERVER_IP}\nUser root\nStrictHostKeyChecking no\nIdentityFile ~/.ssh/id_rsa_blog" > ~/.ssh/config
- chmod 600 ~/.ssh/config
```

原因就是我手动更改了秘钥的名称，所以我需要给`travis`的运行环境中指定访问服务器的私钥位置，为了保证执行过程正确，将文件的权限设置为`600`。

## 3.加密私钥（id_rsa）文件

在本地可以通过公私钥的方式连接服务器了，但是这份文件不能随项目源文件上传至服务器中，这样别人就能通过私钥直接访问我们的服务器了！

travis提供了加密文件的方法，使用travis工具将我们的私钥文件进行加密，然后将加密后的私钥文件随项目上传到github中。在构建时，会通过工具生成的命令解密文件并释放到对应的目录中。

```text
openssl aes-256-cbc -K $encrypted_d0435390278d_key -iv $encrypted_d0435390278d_iv -in id_rsa_blog.enc -out ~/.ssh/id_rsa_blog -d
```

### 安装ruby

travis-ci工具是通过[ruby](http://www.ruby-lang.org/en/documentation/installation/)安装的，因此需要先安装ruby。安装ruby的方式有多种，我们不需要多版本的ruby，因此就不用`rbenv`来安装，而且这会增加安装的复杂度。直接通过命令安装最新的ruby版本即可：

```shell
sudo apt-get install ruby-full
# 或
sudo apt-get install ruby
```

:::warning
工具的安装在本地进行，强烈建议使用windows的用户在Linux虚拟机中完成ruby和tarvis-ci工具的安装！这也是本文一开始[环境准备](/ci&cd/travis.html#环境准备)中提议的！不仅如此，在windows环境下加密的文件非常有可能发生在travis构建时无法解密的情况而失败的情况。不信邪的我已经踩过这个坑，网上也有相关资料提出了这个问题[Bad decrypt](https://jannchie.github.io/2019/04/17/%E8%BF%90%E7%BB%B4/travis-trap/)
:::

### 安装travis工具

```shell
gem install travis --no-document
```

对安装有疑问可以访问[官方安装文档](https://github.com/travis-ci/travis.rb#installation)

若因为网络问题无法安装，可以参考网上换源的方式进行安装，或是使用梯子！此处不做过多介绍。

### 使用travis工具加密私钥

:::tip
使用travis工具前，需保证执行路径在**项目**的根目录！
:::

使用加密工具需要先进行账号登录，绑定了github账号的使用github账号密码登录。

```shell
# 使用 --auto 会自动选择合适的方式登录
travis login --auto
```

若发生无论怎么输入密码都无法登录的情况，可以使用第二种方式使用token登录:

```shell
# -t 是 --token 的缩写
# 由于 travis官方不再推荐使用 travis-ci.org 新创建的用户都默认在 travis-ci.com 上
# 因此，请使用 --pro 或 --com 参数指明登录的网站，否则可能登录失败。
travis login --pro -t 在Github上生成的token
```

请在已登录Github情况下通过此链接[https://github.com/settings/tokens](https://github.com/settings/tokens)访问token生成页面。

非常建议使用[此链接内](https://github.com/travis-ci/travis.rb/issues/529)推荐的token生成配置，否则可能因缺少权限无法登录travis工具的情况！

加密`id_rsa`私钥文件：

```shell
travis encrypt-file ~/.ssh/id_rsa --add --pro
```

执行完成后:

1. 在项目的根目录得到一个`id_rsa.enc`文件。这个文件就可以跟随项目上传至Github了！
2. 另外会在`before_install`生命周期内添加解密命令;

```yml
before_install:
- openssl aes-256-cbc -K $encrypted_d0435390278d_key -iv $encrypted_d0435390278d_iv
  -in id_rsa_blog.enc -out ~/.ssh/id_rsa_blog -d
```

3. 在travis项目的`setting -> Environment Variables`内看到在travis构建时所需的解密数据。我们也可以自己在`Environment Variables`内添加一些不想在`.travis.yml`文件内被他人看到的信息，例如服务器用户名和IP，那么就可以将这些数据配置到这里用一个变量名保存，在`.travis.yml`文件内需要使用到的地方用`${变量名}`来代表其值。

## 4.在after_success内完成文件拷贝

```shell
scp -o stricthostkeychecking=no -r ./* ${SERVER_NAME}@${SERVER_IP}:/usr/local/nginx/html/blog
```

使用`scp`命令加`-r`参数可以完成目录的拷贝，这里唯一需要注意的点：

如果是用的`root`用户登录并期望将文件拷贝到`root`用户家目录内，请用`~/xxx`代替`/root/xxx`。虽然是root用户，但远程访问时并不一定拥有`/root`目录的访问权限！所以最好是拷贝到一个其他保证拥有访问权限的位置！不然会出现在travis中所有构建流程正确但是文件未被拷贝过去的情况，即使在本地执行这条命令是可是正常拷贝的！

所有的步骤都已完成，现在可以对项目发起一次提交，查看travis自动构建过程吧！
