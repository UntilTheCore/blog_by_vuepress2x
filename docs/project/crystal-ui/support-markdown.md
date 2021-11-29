# 支持markdown语法格式

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
