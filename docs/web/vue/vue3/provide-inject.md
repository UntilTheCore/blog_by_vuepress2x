# 用provide和inject实现数据传递

使用`props`将父组件的数据传递到含有多层结构的子组件中是非常麻烦的，若是想要在子组件中改变这个数据，再用`emit`一层层往上触发事件的过程可以说是“灾难性”的。

而`provide`和`inject`则非常友好的处理了这个问题，首先需要明确的是，`provide/inject`并非是响应式的，本身是自上而下的数据传递。Vue3起在`provide/inject`中可以组合使用新增的[响应式API => ref](https://v3.cn.vuejs.org/api/refs-api.html#ref)来达到数据响应式的能力。

预设一个场景：页面包含导航栏和侧边栏，点击导航栏某个按钮可以控制侧边栏的显示和隐藏。涉及到的组件包含`<App />`、`<Nav />`、`<Aside />`。

## 实现过程

通过`<router-view>`渲染页面的根组件`<App />`向后代组件提供(provide)响应式数据支持，`<Nav />`组件中获取(inject)并调用切换`<Aside />`显示的方法，`<Aside />`组件中获取(inject)并使用数据(v-show/v-if)控制侧边栏的显示。

## 简单案例

```vue
<!-- App.vue -->
<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'

// 通过 ref 创建响应式数据
const asideVisible = ref(false);
// 提供切换显示的函数
const toggleAsideVisible = () => {
  asideVisible.value = !asideVisible.value
}
provide('asideVisible', asideVisible);
provide("toggleAsideVisible", toggleAsideVisible);
</script>
```

```vue
<!-- Nav.vue -->
<template>
  <div class="nav">
    <div class="logo" @click="toggleAsideVisible">LOGO</div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const toggleAsideVisible = inject<() => void>("toggleAsideVisible");
</script>
```

```vue
<!-- Aside.vue -->
<template>
  <!-- ref 数据在模板使用时会自动解包 -->
  <aside v-show="asideVisible">
    aside
  </aside>
</template>

<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import { inject, Ref } from 'vue';

const asideVisible = inject<Ref<boolean>>("asideVisible");
</script>
```

注：

1. `ref`数据在模板中使用会自动解包，即不用再特别写`asideVisible.value`；
2. 由于`ref`创建的数据是响应式的，所以我们可以不在根组件`<App />`中提供切换方法，转而在特定需要操作`ref`变量的组件中改变这个值。比如上述示例中可以在`<Nav />`中创建`toggleAsideVisible`函数来改变`asideVisible`的值。但是，这并非是官方所建议的办法（Vue：建议尽可能将对响应式 property 的所有修改限制在定义 provide 的组件内部）。我也认同官方的说法，毕竟谁提供谁处理的方式更易维护！
3. 将不想被后代组件操作的变量用`readonly`修饰处理，主要与2中的思想进行结合；
4. 使用typescript，需明确`inject`时数据类型；

参考资料：[Provide/Inject介绍](https://v3.cn.vuejs.org/guide/component-provide-inject.html#%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%E6%80%A7)、[Provide和Inject的响应性](https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html#%E5%93%8D%E5%BA%94%E6%80%A7)、[Ref 解包](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#ref-%E8%A7%A3%E5%8C%85)
