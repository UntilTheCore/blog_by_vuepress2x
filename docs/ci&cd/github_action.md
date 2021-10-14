# Github Actions自动构建部署到云

travis ci是一款优秀的持续集成和部署工具，但令人遗憾的是，它开始转向收费模式。新用户会给10000积分(Linux上1分钟=10积分)的构建用时，用完后就需要进行付费购买，虽然官方说可以发送邮件免费获取，但这有点过于麻烦了。我们应该支持付费，毕竟别人提供服务也需要资金支持运营，不过对于个人开源项目本身使用量不大的情况只给1000有些不太够用！

但另一个让人高兴地消息是Github也开始（2018年起）提供CI/CD服务(Github Actions)，不仅如此，开源项目他是免费的！即使是私有仓库他也提供每月2000分钟的使用支持！

## Github Actions入门

Github Actions上手较为简单，推荐阅读[阮一峰GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

## 环境准备

1. Github账号和一个用于自动构建的库；
2. 一台安装CentOS的云服务器；
3. SSH连接工具PuTTY、SecureCRT或其他SSH连接工具，主要用于密钥文件的上传； 

