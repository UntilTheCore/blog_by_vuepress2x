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