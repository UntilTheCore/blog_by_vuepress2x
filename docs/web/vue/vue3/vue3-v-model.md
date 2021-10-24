# vue3的v-model

## 破坏性更新

### 支持多个v-model

是的，现在支持在自定义组件上写多个`v-model`了，这主要是为了优化曾经同样的`v-bind.sync`解决方案，v2版本中为了实现多个`props`的“双向绑定”，在`v2.0`其开始支持`.sync`语法。

回顾一下旧的方式实现多个属性的双向绑定：

之前v2时默认使用`value`属性+`input`事件来实现的`v-model`,现在它们改名了，现在为`modelValue`+`update:modelValue`;

参考资料：[v3 v-model](https://v3.cn.vuejs.org/guide/migration/v-model.html#v-model)、[v-model自定义修饰符](https://v3.cn.vuejs.org/guide/component-basics.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-v-model)
