# 配置命令别名

## Bash

:::tip
推荐阅读：[阮一峰-Bash脚本教程](https://wangdoc.com/bash/intro.html)
:::

在用户的根目录下的`bashrc`文件内做如下的配置即可实现命令别名设置：

```bash
# 配置 git 的命令别名
# '='的两边不能有空格，这是规定
alias gts="git status"
alias gph="git push"
alias ga="git add ."
alias gpl="git pull"
```

普通的命令别名非常简单，但是想要接收参数怎么办？使用函数即可！函数的定义方式有两种：

```bash
# 方式一，使用 function 关键字
function a() { echo "hello world" }

# 方式二：直接定义，即去掉关键字 function
a() { echo "hello world" } 
```

`bash`中获取参数是通过一个特殊的[参数变量](https://wangdoc.com/bash/function.html#%E5%8F%82%E6%95%B0%E5%8F%98%E9%87%8F)获取的，因此我们可以通过它来获取外部传参

```bash
gitCommit() {
  git commit -m "$1"
}

# 这里的 gitCommit 表示调用这个函数
alias gcm="gitCommit"

# 使用时 => gcm 提交
# 最终执行结果 => git commit -m "提交"
```

## PowerShell

在 `win` 上，中文用户使用 `PowerShell` 总会出现一些奇奇怪怪的问题，大部分和语言环境是中文有关，但又不能不用中文。典型的例子就是使用 `nvm` 的 `use` 命令选择了 node 版本后出现乱码并且失败！因此即使在 `win` 上，也最好安装一个可执行 `shell` 命令的终端，推荐 [cmder](https://cmder.net/)。

而在 `vscode` 中，可以把 cmder 中的 `bash` 集成进vscode，但个人感觉不太好用，操作总感觉有延迟。而在coding过程中，又不想频繁切换窗口，因此还是把PowerShell的alias配置上，在大部分的场景下，它还是能用的。

### 1.确定本机脚本执行策略

```text
Restricted - 不能运行任何脚本和配置文件
AllSigned - 所有脚本和配置文件必须拥有受信任的发布者的签名
RemoteSigned - 所有脚本和配置文件从可以是互联网上下载，但必须拥有受信任的发布者的签名
Unrestricted - 所有脚本和配置文件都将运行，从互联网上下载的脚本在运行前会有提示。
```

使用 `Get-ExecutionPolicy` 命令查看本机策略，一般默认是 `Restricted`，通过 `Set-ExecutionPolicy Unrestricted` 设置为都可运行。

### 2.确定本机$Profile是否存在

```powershell
test-path $Profile
# false - 不存在
# true - 存在
```

### 3.创建配置文件

```powershell
New-Item -Path $Profile -ItemType file -Force
```

生成的文件： `C:\Users\你的用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`。

### 4.编写配置文件

推荐使用微软的 `Window PowerShell ISE` 编辑器来编写配置，它可以提供一些语法提示。 `win10/11` 用户直接本机搜索 `ISE` 应该会直接出现。

`PowerShell` 的 `alias` 和 `bash` 的十分相似，使用 `Set-Alias` 创建别名，创建函数必须要用 `function` 关键字，而且获取参数要用 `$args`：

```powershell
function fn_gts {git status}
function fn_ga {git add .}
function fn_gph {git push}
function fn_gpl {git pull}
# 通过 $args 获取外部传入
function fn_gitc {git commit -m $args}
Set-Alias ga fn_ga
Set-Alias gts fn_gts
Set-Alias gph fn_gph
Set-Alias gpl fn_gpl
Set-Alias gcm fn_gitc
```
