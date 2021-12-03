# 源码提取器

源码提取器的功能是将本地的代码读取并将处理后的代码内容 `注入` 组件中，在调用组件时可获取到被注入的内容！它依赖于 `自定义块（custom blocks)` ，而自定义块的作用是为 `提取器` 提供处理标记点，`提取器` 会根据所预设处理的 `块名` 来处理块里面的内容。

注意：源码提取器并不必须依赖 `自定义块` ，它仅仅作为标记点提供功能所需而已。你完全可以根据自身所需提取所有相关文件源码和内容。

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
