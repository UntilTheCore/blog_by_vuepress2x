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

## The above dynamic import cannot be analyzed by vite

```text
The above dynamic import cannot be analyzed by vite.
See https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations 
for supported dynamic import formats. If this is intended to be left as-is, you can use 
the /* @vite-ignore */ comment inside the import() call to suppress this warning.
```

出现这个警告的原因是项目中使用了动态加载函数 `import()`，而且加载的路径无法被 `Vite - rollup-dynamic-import-vars` 正确解析（不规范的路径），如果不管它，会造成页面无法正确加载的问题！解决办法也非常简单，按照出现的提示[链接](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations)中的内容将动态路径以相对路径开头，以具体的文件后缀结尾且变量前有可明确的路径或部分模块名称，比如：

```ts
// 正确
import(`./foo/${bar}.js`);
import(`./module-${foo}.js`);
// 错误
import(`./${foo}.js`);
```

更多用法请参见[官方示例](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations)。
