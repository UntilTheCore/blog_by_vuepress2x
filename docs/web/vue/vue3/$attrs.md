# 「轻松搞懂」$attrs

## 能拿来做什么

> 禅语：如果不知道它能拿来做什么？那要“晓得”它来做什么？

### 简化属性（attribute）传递

当没有`v-bind="$attrs"`时，若一定要将事件绑定到子组件的非根元素上，你是否会想到这样做：

```vue
<!-- Father.vue -->
<template>
  <div>
    <Child class="new-child" @click="handleClick" />
  </div>
</template>

<script>
import Child from "./components/Child.vue";
export default {
  name: "App",
  components: {
    Child,
  },
  methods: {
    handleClick(e) {
      // 查看被绑定的元素是否正确
      console.log(e.currentTarget);
    },
  },
};
</script>
```

```vue
<!-- Child.vue -->
<template>
  <div class="child">
    <!-- 使用.stop 修饰符避免 事件冒泡 触发已经默认绑定到根元素的 click 事件 -->
    <button @click.stop="handleClick">Child btn</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(e) {
      // 触发 click 事件
      this.$emit("click", e);
    },
  },
};
</script>
```

若要使实现相对“完美”一点：1.不用被隐藏绑定事件在根元素上；2、不用`.stop`修饰符；可以给子组件添加`inheritAttrs: false`选项以取消属性的默认绑定：

```vue {11}
<!-- Child.vue -->
<template>
  <div class="child">
    <!-- 使用.stop 修饰符避免 事件冒泡 触发已经默认绑定到根元素的 click 事件 -->
    <button @click="handleClick">Child btn</button>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  methods: {
    handleClick(e) {
      // 触发 click 事件
      this.$emit("click", e);
    },
  },
};
</script>
```

上述方案似乎是解决了属性绑定的问题，但过程非常繁琐！于是`Vue`提供了一个简便的属性`$attrs`来帮助简化这个过程：

:::warning
依然需要配置`inheritAttrs: false`选项，因为`v-bind="$attrs"`和属性的默认绑定是不冲突的。也就是若未配置，除了`v-bind`处有了绑定，根元素上也有一份本期望不被绑定的绑定。事件会在两个地方各被触发一次！
:::

```vue {3,9}
<template>
  <div class="child">
    <button v-bind="$attrs">Child btn</button>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
```

## 做了哪些升级

`$attrs`在Vue3中有一些不兼容的更新：

1. 移除了`$listeners`：使用过的肯定知道它通常和`$attrs`搭配着一起出现。现在它被移除了，并将其功能放入了`$attrs`中，也就是说现在应从`$attrs`中获取外部传入的`事件函数`；
2. Vue2中不能自定义`class`和`style`位置的问题在Vue3中得以实现，现在它们都包含在了`$attrs`里；

参考资料：[移除$listeners](https://v3.cn.vuejs.org/guide/migration/listeners-removed.html#%E7%A7%BB%E9%99%A4-listeners)、[$attrs包含class & style](https://v3.cn.vuejs.org/guide/migration/attrs-includes-class-style.html#attrs-%E5%8C%85%E5%90%AB-class-style)

## 非根节点的 attribute 绑定

父组件在使用子组件时传递的所有属性（attribute）默认情况下都绑定在子组件的根节点上：

```vue
<!-- father.vue -->
<template>
  <Child class="xxx" />
</template>
```

此时生成的HTML结果为：

```vue
<!-- Child.vue -->
<template>
  <!-- class 会合并 -->
  <div class="child xxx">
    <button>Child btn</button>
  </div>
</template>
```

:::tip
子组件的根节点默认拥有一个class的话，传入的class将与其**合并**，并不会覆盖！
:::

## 需要注意哪些

### \<script setup\>中使用inheritAttrs

### 多节点的attribute绑定问题
