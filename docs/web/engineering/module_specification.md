# JS模块规范厘清

本文的目的是消除了解相关模块概念但还未有清晰认知的读者进一步加深理解，因此关于 CJS、AMD、UMD、ESM 这些模块规范的详细解释本文不做讨论，通过搜索引擎可以查到非常多的资料。（AMD已经用得非常非常少了，我是基本没用过，也不作讨论）

对于模块规范的文章，已经多如牛毛了，无外乎这些内容：CJS 是使用 `module.exports` 来导出模块内容，然后通过 `require` 进行引入, ESM 通过 `export` 导出模块，用 `import` 导入模块，UMD则都支持等。

| 规范名 | 导出方式 | 引入方式 |
| - | - | - |
|  CJS  | module.exports | require |
|  UMD  | node端：module.exports，浏览器端：window | node端：require，浏览器端：window |
|  ESM  | export | import |

`UMD` 规范包的代码编写方式：

```js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // ADM 导出
    define([], factory);
  } else if (typeof exports === "object") {
    // CJS 导出
    module.exports = factory
  } else {
    // 挂载到根 node 是 global ，浏览器是 window
    root.myModule = factory;
  }
}(this, function () {
  // 这里是具体的模块实现内容
  console.log("UMD Module")
}));
```

像一些关于打包的文章，只介绍了如何打成某种包，说打成某种规范的包可以得到哪些环境支持等。但却不说为什么，也不说应用场景，造成新手包是打了，却发现有的地方用不了。比如 `UMD` 的包，有可能有的人用 `vue cli` 搭建的工程引入后不报错，但自己依托于 `webapck` 搭建的工程一引入就报错 `Uncaught TypeError: Cannot read properties of undefined`。在没搞清楚事情原委前，可能还一直以为自己打的包是不是有兼容性问题。

阅读上面基于 `UMD` 规范的代码，我们会发现 `UMD` 就是一个 `iife`， 然后判断当前运行的环境，是 `node` 且支持 `exports` 那就把包挂载上去，不支持就挂到 `全局变量` 上，node 上是 `global` ，要是运行于 `浏览器` ，那就是挂载到 `window` 。

了解到这些，我们再进一步讨论其他内容，对于现在的项目以及学习资料，基本都照着 es6 来讲了，项目中也是一律用 `import`、`export` 来导入和导出包。在自己没创作过包的情况下，可能天然以为是个包就用 `import` 导入即可，尤其是现在各种 `cli` 工具帮助开发者做了相当多地 `开箱即用` 的配置，导致一些模糊的知识点被掩盖其中！

前置内容已经铺垫完成，现在正式说结论！

正常来说，`UMD` 包就不能被 `import` 的！`import` 是 `ESM` 模块的规范，它俩本身毫无关系！一些兼容于浏览器的 `UMD` 包，比如 `react` 、 `vue` 它们都是向全局变量 `window` 注入了一个新的全局属性以供开发环境使用。也就是说，我们开发的包如果要供给用户通过 `<script src="">` 的方式使用，那么可以发布为 `UMD` 规范的包。但若还要让用户可以 `import` ，那就必须再提供一个 `ESM` 的包。

对于大部分的 `webapck` 相关的 `cli` 用户，比如使用 `vue cli` 的用户，会发现项目中直接 `import` `UMD` 的包也是可以的，其实这完全归功于 `@babel/plugin-transform-modules-umd` 插件，由它将 `UMD` 的包转译为 `ESM` 的包供我们使用，我们没有看到 `babel.config.js` 直接的插件配置，是因为 `vue cli` 把这些细节封装起来了。

而在 [vite](https://cn.vitejs.dev/guide/dep-pre-bundling.html#the-why) 项目中：“由于 `vite` 的开发服务器将所有代码视为原生 ES 模块，因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。” 但经过测试，当前对 `UMD` 包的转译还不完善，对于基于 `vue` 开发的UI库在使用时会提示错误 `Uncaught TypeError: Cannot read properties of undefined (reading 'pushScopeId')` 。

大多项目应对开发环境都是导出 `CJS` 和 `ESM` 规范的包，并且在 `package.json` 中进行如下配置让用户的开发环境打包工具可以正确导入对应的包：（当然，给 `require` 的包也可以用 `umd` 规范的。）

```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js", // 给 import 用
      "require": "./dist/my-lib.cjs.js" // 给 require 用
    }
  }
}
```

当我们厘清打包和导包的规则后，就不再怕用错啦！

最后总结：

1. 在浏览器端提供全局作用域包，使用 `UMD`；
2. 提供给 node 使用的包，可以使用 `UMD` 和 `CJS`；
3. 提供给浏览器和 es6 模块的包，使用 `ESM`；
4. 打包工具中对各种包以支持 `import` 方式导入需要使用对应的插件进行转换；
