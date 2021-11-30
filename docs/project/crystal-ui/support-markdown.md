# 支持markdown语法格式

:::tip
此文对应的：vite 版本为 v2.6.14，vue 版本为 v3.2.23，marked 版本为 v4.0.5
:::

让页面内的 `h1` 、 `p` 、 `pre` 等标签得到类似 `github` 内容格式的样式，可以使用 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)

1.**安装**

```bash
# 安装
yarn add github-markdown-css
```

2.**使用**

```ts
// 1.在 main.ts 或 main.js 中引入
import "github-markdown-css";
```

```html
<!-- 2.需要被设置样式的包裹容器上设置 class="markdown-body" -->
<article class="markdown-body">
 <h1>Unicorns</h1>
 <p>All the things</p>
</article>
```

完成上述步骤，在页面上的被 `markdown-body` 标签包裹的内容即可支持类 `Github` 上 markdown 的样式。但这只是样式得到更改了，自己仍然需要编写相对应的标签以支持样式内容，可不可以只写传统 `markdown` 文件然后支持 `import` 引入实现内容的渲染呢？

## 支持markdown文件引入

### typescript支持

本身 ts 是不认识 `.md` 文件的， `import` 时会被 ts 提示错误，因此我们需要编写 `markdown.d.ts` 文件让 ts 认识 `.md` 文件来取消错误警告！

```ts
declare module "*.md" {
  const content: string;
  export default content;
}
```

### 依赖引入

在 `vite` 中，由于使用的是 `rollup` ,因此是没有 `webpack loader` 概念的，想要将传统 `markdown(.md)` 文件进行 `编译` 需要借助一个工具 [marked](https://marked.js.org/) 。

另外自己需要编写一个 `vite plugin` 并使用 [marked](https://marked.js.org/) 来完成本地 `.md` 文件的编译和导出，以支持工程内文件可以得到正确的 `import` ，否则将被提示 `Uncaught SyntaxError: Invalid or unexpected token` ，因为浏览器根本不认识这个文件。

安装marked：

```bash
yarn add -D marked
# 若使用 typescript ，还需安装 @types/marked
yarn add -D @types/marked
# 可以简写为
yarn add -D marked @types/marked
```

### 插件编写

请先简要阅读插件源码，请注意几个名字 `configureServer` 、 `transform` 、 `mdToJs` ：

```ts {7,16,31}
// vite.config.ts
import path from "path";
import fs from "fs";
import { marked } from "marked";
import { Plugin } from "vite";

const mdToJs = (str: string) => {
  const content = JSON.stringify(marked.parse(str));
  return `export default ${content}`;
};

export function vitePluginMd(): Plugin {
  return {
    name: "vite-plugin-md",
    // 用于开发
    configureServer: ({ middlewares }) => {
      middlewares.use((req, res, next) => {
        if (req.url.includes(".md?import")) {
          const filePath = path.join(process.cwd(), req.url.split("?")[0]);
          const content = mdToJs(fs.readFileSync(filePath).toString());
          res.writeHead(200, {
            "Content-Type": "text/javascript; charset=utf-8",
          });
          res.end(content);
        } else {
          next();
        }
      });
    },
    // 用于 build
    transform(code, id) {
      if (id.endsWith(".md")) {
        return mdToJs(code);
      }
    },
  };
}
```

你可以不了解 `vite` 和 `rollup` 的插件机制，通过下面的介绍可以完全理解源码内容，若期望深入了解具体细节，推荐阅读以下相关内容 [Vite Plugin](https://vitejs.cn/guide/api-plugin.html#plugin-api) 、 [Rollup transform](https://rollupjs.org/guide/en/#transform) 、 [NodeJS Http](http://nodejs.cn/api/http.html)。

`configureServer`这个配置可以影响在本地开发环境时的内容，而 `transform` 则是影响在打包时的内容。他们的核心能力是对文件的二次处理，有点像 `loader` 。在此处就是将被 `marked` 编译过成字符串的 `.md` 文件输出给引用处的 `import` 以供使用。`mdToJs` 就是完成这个操作的核心功臣，它将文件编译，然后将编译好的字符串前添加 `export default` 让浏览器得以识别！

在旧版的`vite`中，开发服务器使用是的 `koa` ，一些网上旧的资料所提供的插件编写办法也是基于此，因此在新版 `vite` 中无法运行，所以我在文章最开始说明了所用版本，希望你在阅读此文并操作时避免版本不同而引发的错误！

当前版本的 `vite` 开发服务器大致完全使用 `Node` 原生 `http` 的能力，因此需要去简单了解一下。需要注意的是在浏览器的文件导入时对文件的引入路径是 `.md?import` ，因此需要进行一定的字符串裁剪，然后通过路径拼接在本地获取相关 `.md` 文件。对不需要处理的文件一定要执行 `next` 将请求放行，否则将使页面卡住！

`transform` 中参数名有些奇怪，`id` 是文件名（含路径），`code` 内是文件的内容，`transform` 在 `return` 时提供新的文件内容。

注意：插件提供的是项目运行前的转译，因此在本地编写的 `markdown` 文件不支持热更新，在内容更新时需要重启项目。

### markdown 文件引入

```vue {2,7}
<template>
  <article class="markdown-body" v-html="md"></article>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import md from '@/markdown/intro.md';

export default defineComponent({
  data() {
    return {
      md
    }
  }
})
</script>
```
