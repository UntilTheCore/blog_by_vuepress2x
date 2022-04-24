# npm init 和 yarn create

我们会在很多的官方网站上看到使用 `npm init` 或 `yarn create` 来创建和初始化项目的命令，这其实是一个创建项目的 `语法糖` 命令。

以 `create-react-app` 官方的例子做介绍。我们用此包创建项目的话，完全手动的方式就是：

1. 安装 `create-react-app`

::::code-group
:::code-group-item yarn

```bash
yarn global add create-react-app
```

:::

:::code-group-item npm

```bash
npm i create-react-app -g
```

:::
::::
2. 创建项目

```bash
create-react-app my-app
```

而如果通过 `npm init` 或 `yarn create` 来创建就可以省略为一步：

::::code-group
:::code-group-item yarn

```bash
yarn create react-app my-app
```

:::

:::code-group-item npm

```bash
npm init react-app my-app
```

:::
::::

根据上面的介绍，会发现这其中有一个规律，就是用 `init`、`create` 创建时，原完整的包名 `create-react-app` 就可以省略 `create-` 了。

原因是在命令的内部，它们帮我们做了一些操作：

1. 如果是 `yarn`: 会先全局安装 `create-react-app` ，然后调用 `create-react-app my-app` 来创建项目；
2. 如果是 `npm`: 会执行 `npm exec create-react-app` 命令，过程也是安装包然后调用 `create-react-app` 内的主命令文件，等同于 `create-react-app my-app`;

根据包管理器的这些特性，我们若希望简化用户使用包时，应当创建一个包名以 `create-` 开头的包并提供主 `bin` 文件以供包管理工具或用户调用。

参考资料：[npm ini](https://docs.npmjs.com/cli/v8/commands/npm-init#description) 、 [yarn create](https://classic.yarnpkg.com/en/docs/cli/create#toc-yarn-create)
