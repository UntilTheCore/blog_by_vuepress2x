# 注意事项

## 关于CSS

### UI库组件的style上不加scope

因为 `data-v-xxx` 中的`xxx`每次运行可能都不相同，为了保证class选择器的稳定，方便使用者覆盖，需要取消`scope`。

### class必须加前缀

没有前缀的class非常容易被意外覆盖，比如`<Button />`组件的class就叫`.button`是不合适的。可和库名相关，比如`el-button`、`cs-button`等。
