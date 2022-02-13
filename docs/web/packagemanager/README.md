# npm & yarn

npm 和 yarn 都是包管理工具。

简单了解npm和yarn：

1. [npm 和 yarn 你选哪个？](https://zhuanlan.zhihu.com/p/99186425);
2. [一文看懂npm、yarn、pnpm之间的区别](https://zhuanlan.zhihu.com/p/37653878);

## npm alias

从`npm 6.9`版本开始，支持一个新的功能叫[package alias](https://dev.to/abdelrahmanahmed/package-alias-name-using-npm-yarn-d9p)(访问[官方示例](https://docs.npmjs.com/cli/v7/commands/npm-install#synopsis))它的作用是给即将安装的包起一个`别名`，在使用时也都是用这个别名来使用包：

```bash
npm install <alias>@npm:<name>

npm install <别名>@npm:<包名>
```

应用场景：

`create-react-app` 安装的项目默认支持`scss`，但它需要`node-sass`来提供支持，而国内的网络环境对安装`node-sass`非常不友好！因为node-sass自身的一些依赖需要到github上下载。不仅如此，即使下载完成，它还会执行编译过程，因操作系统环境问题常常安装失败！

而`dart-sass`没有这些问题，安装方便快捷。那么在默认情况下既给本地开发环境提供`node-sass`又想安装`dart-sass`这个情况就可以使用上`npm alias`了：

::::code-group
:::code-group-item yarn

```bash
yarn add node-sass@npm:dart-sass
```

:::
:::code-group-item npm

```bash
npm i node-sass@npm:dart-sass
```

:::
::::

使用此方式可以用`dart-sass`伪装成`node-sass`,但引用时依然可以继续以`node-sass`进行引用，从而达到正确编译的效果。

## yarn resolutions

:::tip
在 `package.json` 中且只在 `yarn` 中生效的配置选项，通过这个选项可以修改 yarn.lock 中某个package的版本
:::

假如你的项目依赖了 foo,foo 依赖了 bar@^1.0.0。假设 bar 现在有两个版本 1.0.0 和 1.1.0。很不幸，bar 在发布 1.1.0 的时候没有做好向后兼容。导致 foo 和 bar@1.1.0 不能搭配使用。如果你可以等：

- 要么等 foo 把依赖 bar 锁成 1.0.0 并重新发版；
- 要么等 bar 修复兼容问题后重新发版；

那如果你等不了呢，你已知 foo 和 bar@1.0.0 可以正常工作。如果你能锁住 foo 对 bar 的依赖就好了，但是这定义在 foo 的 packge.json 里，你总不能去改 node_modules/foo/package.json 吧？这不合适。resolutions 可以解决你的问题，只要在你自己项目的 package.json 里定义：

```json
// package.json
{
  "resolutions": {
      "foo/bar": "1.0.0"
  }
}
```

这里的 key"foo/bar"表示 foo 的直接依赖 bar，把版本区间重写成 1.0.0。如果 foo 不是直接依赖的 bar（foo -> ... -> bar），我还需要把中间的链路都捋清楚吗？不用那么麻烦！

```json
// package.json
{
  "resolutions": {
      "foo/**/bar": "1.0.0"
  }
}
```

如果你的项目里有很多依赖直接/间接的依赖了 bar，每个定义的版本区间可能有差别，你知道某个版本可以让他们都能正常工作，而不用安装多个版本。也可以不用声明前缀部分，只写包名 bar。这样不管是哪里依赖到了 bar 都会指向你声明的哪个版本。

```json
// package.json
{
  "resolutions": {
      "bar": "1.0.0"  
  }
}
```

### 在 pnpm 和 npm 中的用法

在 npm或pnpm 中应该用 `overrides` 配置选项实现同样效果，但pnpm中稍许特殊：

::::code-group
:::code-group-item npm

```json
// package.json
{
  "overrides": {
    "foo": "1.0.0"
  }
}
```

:::

:::code-group-item pnpm

```json
// package.json
{
  "pnpm": {
    "overrides": {
      "foo": "^1.0.0",
      "quux": "npm:@myorg/quux@^1.0.0",
      "bar@^2.1.0": "3.0.0",
      "qar@1>zoo": "2"
    }
  }
}
```

:::
:::

::::

`npm` 的覆盖规则较多，有需要可以深入了解：[npm overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides) 、[pnpm overrrides](https://pnpm.io/zh/package_json#pnpmoverrides)

## 如何初始化项目

初始化空包时，我们可以在一个空文件夹下使用 `npm init` 、`yarn init` 、`pnpm init` 来初始化一个包，经过一个提问式的流程后我们就得到了一个 `package.json` 文件。若不想走提问式流程，也可以加 `-y` 参数让脚本执行默认流程来创建。

另一种方式是我们使用脚手架工具，例如 `create-react-app` ，此时使用相关命令为：

::::code-group

:::code-group-item npx

```bash
npx create-react-app my-react-app
```

:::

:::code-group-item npm

```bash
npm init react-app my-react-app
```

:::

:::code-group-item yarn

```bash
yarn create react-app my-react-app
```

:::

:::code-group-item pnpm

```bash
pnpm create create-app my-react-app
```

:::

::::

本身包名叫 `create-react-app` ，但是为了减少手动执行安装 `yarn add create-react-app` 然后再执行 `npx create-react-app` 这个步骤，就约定若一个包用于初始化项目的操作，那么就用 `creact` 作为包名的开头部分！这样，这些包管理器就知道该如何使用包并创建项目了！

另一个约定是这些工具项目需要在 `package.json -> bin` 配置选项中设置正确的进本执行路径，包管理工具正是找到 `bin` 对应的脚本来完成创建过程的！

### 作用域包的包名如何创建和使用

|包管理器|包名|如何初始化|
|-|-|-|
|npm|@foo/create-bar|npm init @foo/bar|
|yarn|@foo/create-bar|yarn create @foo/bar|
|pnpm|@foo/create-bar|pnpm create @foo/bar|
