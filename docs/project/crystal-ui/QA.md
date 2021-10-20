# 问题及参考解决方案

## Error: The package "esbuild-linux-64" could not be found, and is needed by esbuild

这个问题在[Vite issues](https://github.com/vitejs/vite/issues/5187)上已被提及过，通过安装`esbuild`解决。

```bash
yarn add -D esbuild@0.13.4
```

## SassError: There is no module with the namespace "math"

解决方案：在`style`模块的顶部添加如下语句引入`math`模块:

```scss
@use 'sass:math';
```

一些旧的语法在`1.23.0`开始被弃用，在新版的`sass`中使用旧语法比如`/`来表示除运算会被提示弃用并提示推荐的新的语法。但是引入后却可能被提示缺少相关模块，此时需要使用`@use`来导入相关模块。

参考资料：[Built-In Modules](https://sass-lang.com/documentation/modules)、[sass:math](https://sass-lang.com/documentation/modules/math)
