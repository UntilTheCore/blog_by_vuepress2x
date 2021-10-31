# 小知识点

## 属性 ref

> ref 被用来给元素或子组件注册引用信息

元素和组件上的[ref](https://v3.cn.vuejs.org/api/special-attributes.html#ref)支持传字符串和函数，若是使用选项式组件则通常用`this.$refs.xxx`来获取关联的元素。在组合式API `setup` 中，则推荐结合响应式API [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref)使用。

### 响应式 API 中普通用法

```vue
<template>
  <child-component ref="childRef">child</child-component>
</tempalte>

<script setup lang="ts">
import { ref } from 'vue';

// 在 ts 中，需表明元素的类型
const childRef = ref<HTMLDivElement>();
</script>
```

### 响应式 API 中结合函数用法

```vue
<template>
  <!-- el 的类型是 Element |  ComponentPublicInstance -->
  <child-component :ref="el => childRef = el">child</child-component>
</tempalte>

<script setup lang="ts">
import { ref, ComponentPublicInstance } from 'vue';

const childRef = ref<Element | ComponentPublicInstance>();
</script>
```

通过函数获取节点信息且结合ts时，由于无法直接明确节点类型，因此节点可能是普通原生元素(p、div、button等)和vue组件，因此需要进行特别类型声明！

`childRef`的类型和我们最终需要使用的类型可能不是一致的，因此在使用的使用需要先根据所需进行类型断言，比如：

```ts
const childRef = ref<Element | ComponentPublicInstance>();
// 类型断言后，可以得到诸如 classList 和 className 等内容提示
const _childRef = childRef as HTMLDivElement;
```

### v-for 结合 ref

`v-for`和`ref`函数结合时，会自动向响应式数组中填充内容。但需要注意，**要确保每次更新之前重置ref**

参考资料：[ref](https://v3.cn.vuejs.org/api/special-attributes.html#ref)、[模板引用](https://v3.cn.vuejs.org/guide/component-template-refs.html#%E6%A8%A1%E6%9D%BF%E5%BC%95%E7%94%A8)、[v-for 中的用法](https://v3.cn.vuejs.org/guide/composition-api-template-refs.html#v-for-%E4%B8%AD%E7%9A%84%E7%94%A8%E6%B3%95)
