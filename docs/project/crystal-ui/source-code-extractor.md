# 源码提取器

## 简单介绍

源码提取器的功能是将本地的代码读取并将处理后的代码内容 `注入` 组件中，在调用组件时可获取到被注入的内容！它依赖于 `自定义块（custom blocks)` ，而自定义块的作用是为 `提取器` 提供处理标记点，`提取器` 会根据所预设处理的 `块名` 来处理块里面的内容。

注意：源码提取器并不必须依赖 `自定义块` ，它仅仅作为标记点提供功能所需而已。你完全可以根据自身所需提取所有相关文件源码和内容。

## 什么是自定义块（Custom Blocks）

看到这里，你可能有感觉有些迷惑， `自定义块` 到底是个什么东西？简单理解就是一个自定义标签，但并不真的是：

```vue
<demo>这是自定义块</demo>

<template>
  <div>hello world</div>
</template>

<script></script>
```

你可以在 `.vue` 文件中非官方支持的 `template` 、 `script` 、 `style` 外写额外的块内容。

这个东西可以追溯到 [Vue Loader Custom blocks](https://vue-loader.vuejs.org/zh/guide/custom-blocks.html) ，它提供了对 `.vue` 文件内 `自定义块` 的支持。在 `Vue Loader` 中，它是以这条代码去匹配自定义块的内容的 `resourceQuery: /blockType=demo/` ，其中 `demo` 即表示要匹配的块名。

在 `vite` 中，这个特性依然被支持，但在不同的大版本中，对 `自定义块` 的使用却不同:

- `1.x` 版本：可以在 `vite.config.ts` 中的 [vueCustomBlockTransforms](https://github.com/vitejs/vite/tree/1.x#custom-blocks) 配置项中编写处理自定义块的逻辑，我们需要做的就是在 `vueCustomBlockTransforms` 对象中提供名称为自定义块名的函数并做到将处理好的结果进行返回，由于这个可能有多个自定义块，因此可以创建多个函数以实现需求。

```js
// vite.config.js
export default {
  vueCustomBlockTransforms: {
    demo1: ({ code }) => {
      // return transformed code
    },
    demo2: ({ code }) => {
      // return transformed code
    }
  }
}
```

- `2.x` 版本：这个版本开始，`Vite` 官方把一些明确提供的特性进行了去除，但并非是真的去除了，而是把这些功能利用 `Plugin` 的形式实现，尽量最小化耦合！因此， `vueCustomBlockTransforms` 属性无法在 `2.x` 版本的 `vite.config.ts` 中得到配置。现在想要实现同样的效果需要自己编写一个插件来完成了！

::: tip
接下来的内容需要你有一点Vite编写 [插件](https://cn.vitejs.dev/guide/api-plugin.html) 的知识，编写插件很简单，简单看一点文档内容即可上手。
:::

## 正式开始

### 原理理清

1. **自定义块是一份请求资源**

还记得上文中提到的 `Vue Loader` 吗？自定义块不论是在 `webpack` 还是 `vite` 项目，`.vue` 文件都需要被框架所支持，而且即使非框架项目，也需要自己配置 `loader` 来实现项目对 `.vue` 文件的支持。因此，它们的底层原理都是一致的。

一个 `.vue` 文件被 `Vue Loader` 处理时，会将文件内部的 `块` 拆分成多个请求资源 `script` 、 `style` ，`template` 中的 `html` 内容将被交给 `vue dom` 解析器去处理，最终处理为一个 `js render` 函数，其实还是属于 `script` 的内容。

在 `vite@2.x` 中，这些资源会变成一份具有完整路径的请求，比如：`D:/project/crystal-ui-vite/src/views/doc/component/Switch1Demo.vue?vue&type=demo&index=0&lang.demo` 、`D:/project/crystal-ui-vite/src/components/Icon.vue?vue&type=style&index=0&scoped=true&lang.scss` ，其中的关键点 `vue&type=`

看到这个是不是有点熟悉了？它和 `webpack` 中所需的 [blockType](https://webpack.docschina.org/configuration/module/#ruleresourcequery) 表达的意思基本一致，都是为了确定资源块！知道这一点后，我们仅需要在插件中判断需要处理的资源路径是我们设定的自定义块即可！比如设定需要处理的自定义块为 `demo`，那么我们需要处理路径中含有 `vue&type=demo` 的资源。

2.**自定义块是一份类型为script的请求资源**

不论是 `style` 还是 其他自定义块也好，都会被作为 `js` 脚本文件来处理，因为浏览器无法理解 `.vue` 文件，只能处理原生的 `js`、`html` 、 `css` 文件。所以我们需要在编写插件时，将处理完成的代码要像一份 `js` 文件那样，提供 `export default` 来供浏览器调用！

另外，正如 [Vue Loader](https://vue-loader.vuejs.org/zh/guide/custom-blocks.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9D%97) 官方所介绍的那样：“如果这个自定义块被所有匹配的 loader 处理之后导出一个 `函数` 作为最终结果，则这个 `*.vue` 文件的组件会作为一个参数被这个函数调用。”依据这个能力，我们可以将一些东西 `挂载` 在这个实例组件上。

### 源码实现

上述内容都充分理解了吗？现在要开始正式实现 `源码提取器` 了！

1. 根据 `vue&type=demo` 判断我们要处理的自定义块资源是 `demo`;
2. 得到包含 `vue&tyoe=demo`的完整资源路径；
3. 依据获取到的路径从本地读取完整源码；
4. 使用 `@vue/@vue/compiler-core` 中的 `baseParse` 解析源码；
5. 从解析的源码的AST中获取属于 `demo块` 的源码；
6. 把 `demo块` 的源码从整个文件源码字符串中移除；
7. 返回默认导出函数的字符串，将去除 `demo块` 内容的源码和包含在 `demo块` 中的内容挂载到组件实例中；

**源码：**

```ts
// vitePluginVueFile
import { Plugin } from "vite";
import { baseParse } from "@vue/compiler-core";
import fs from "fs";

export default function (): Plugin {
  return {
    name: "vite-plugin-vue-file",
    transform(code, id) {
      if (/vue&type=demo/.test(id)) {
        const path = id.split("?")[0];
        const file = fs.readFileSync(path).toString();
        
        const parsed = baseParse(file).children.find(
          (n: any) => n.tag === "demo"
        );

        const main = file.split(parsed.loc.source).join("").trim();

        return `export default component => {
          component.__sourceTitle = ${JSON.stringify(code)}
          component.__sourceCode = ${JSON.stringify(main)}
        }`.trim();
      }
    },
  };
}
```

**注意**:

- code 中的内容是不包含`<demo></demo>`的，只含有块里面的内容;
- 返回的内容若包含有变量，变量类型不论是字符串还是对象，都最好将其`JSON序列化`，在源码提取器中，提取的源码中既含有单引号字符、也含有双引号字符，因此会因为引号匹配的问题从而导致导出后的解析出错，对象同理。
