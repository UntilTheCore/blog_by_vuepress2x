# 注意事项

## 关于 Vue

### 公共组件加上 key

我们都知道 `v-for` 时要为组件提供唯一的 `key` ，但在其他场景下，即非 `v-for` 渲染组件时，用到了公共组件也要为其提供 `key` ，尤其是在同一页面下有多个地方使用了这些组件，若不提供，会使得 `Vue` 将无法识别组件唯一性，从而使页面无法正确显示。

```ts
h(Markdown, {filename: '../markdown/intro.md', key: 'intro'});

h(Markdown, {filename: '../markdown/install.md', key: 'install'});
```

## 关于CSS

### UI库组件的style上不加scope

因为 `data-v-xxx` 中的`xxx`每次运行可能都不相同，为了保证class选择器的稳定，方便使用者覆盖，需要取消`scope`。

### class必须加前缀

没有前缀的class非常容易被意外覆盖，比如`<Button />`组件的class就叫`.button`是不合适的。可和库名相关，比如`el-button`、`cs-button`等。

### 额外创建全局样式并让外部引入

组件应有自己的整个组件库的全局样式，这个文件需要创建者提供。在使用其他组件库时也常常在UI文档的介绍内看到让引入它们的全局样式文件。
