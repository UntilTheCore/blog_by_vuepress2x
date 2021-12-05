# 支持代码高亮

项目中借助第三方库 [prismjs](https://prismjs.com/) 来实现展示代码的高亮。

## 安装 prismjs

```bash
yarn add prismjs
```

由于 `prismjs` 不是使用ts编写的，也没有官方提供签名文件，因此在 typescirpt 项目中，可以安装 `@types/prismjs` 来支持代码提示并解决 ts 在引入时提示无法找到模块的问题。但若是引入后依然无法解决这个问题，可以自己在任意一个 `.d.ts` 结尾的文件中编写 `declare module 'prismjs';`。坏处是没有具体的相关方法的提示。

## 引入

```ts
// 引入 js
import Prism from 'prismjs';
// 引入 css
import "prismjs/themes/prism.css";
```

在 prismjs 的 `themes` 目录下提供了多种主题供我们使用，比如 `import "prismjs/themes/prism-okaidia.css";` 是一个暗色主题。

若通过 `js` 的方式引入主题样式失败，可以额外写一个没有 `scope` 的 `style` ，并添加 `@import "prismjs/themes/prism.css";`

```vue
<style lang="scss" scoped>
  .class { ... }
</style>

<!--  额外添加下面这一段 -->
<style lang="scss">
  @import 'prismjs/themes/prism.css';
</style>
```

## 使用

1. 获取到经过 `prism` 处理过后的 `html` 富文本内容；
2. 使用 `pre` 标签包裹富文本内容；
3. 若需要代码背景颜色，在 `pre` 标签添加 `class="language-html"`；

`language-` 后面的内容根据自己处理的语言来设置，支持的语言有[这些](https://prismjs.com/#supported-languages)，我们设置时使用的是 `-` 右侧的名称，静态属性和类名中提供的一致！

**完整参考**

```vue {10}
<template>
  <div>
    <h1>Switch 组件示例</h1>
    <div class="demo">
      <h2>{{ Switch1Demo.__sourceTitle }}</h2>
      <div class="demo-component">
        <Switch1Demo />
      </div>
      <div class="demo-code">
        <pre class="language-html" v-html="Prism.highlight(Switch1Demo.__sourceCode, Prism.languages.html, 'html')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Switch1Demo from './Switch1Demo.vue';
import Switch2Demo from './Switch2Demo.vue';
import Prism from 'prismjs';
// 暗色主题
// import "prismjs/themes/prism-okaidia.css";
import "prismjs/themes/prism.css";
</script>
```
