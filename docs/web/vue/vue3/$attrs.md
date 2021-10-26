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

### 多级组件间通信

::::code-group

:::code-group-item Grandpa组件
```vue
<!-- Grandpa.vue -->
<template>
  <div>
    <Child @change="handleChange" />
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
    handleChange(v) {
      console.log("get change", v);
    },
  },
};
</script>
```

:::

:::code-group-item Father组件

```vue
<!-- Father.vue -->
<template>
  <div class="child">
    <GrandSon v-bind="$attrs" />
  </div>
</template>

<script>
import GrandSon from "./GrandSon.vue";
export default {
  inheritAttrs: false,
  components: {
    GrandSon,
  },
};
</script>
```

:::

:::code-group-item GrandSon组件

```vue
<!-- GrandSon.vue -->
<template>
  <div class="grand-son">
    <input
      placeholder="please input value"
      type="text"
      @input="$emit('change', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
```

:::
::::

`$attrs`可以用来实现如`爷孙`之间的通信，我认为这算是一个`黑魔法`！若只是层级结构为`爷-父-孙`且内容结构简单还好，在更多的层级传递时，还需继续重复`v-bind`的书写步骤。

不仅如此，你应该也注意到，每个组件的内部，都重复性地添加了`inheritAttrs: false`配置，由于`attributes`的默认根节点绑定是隐式的，若这个属性忘记配置或有重复性的事件名在后期维护时被添加，那么会非常容易造成组件间的逻辑变得混乱，最终变成难以维护的情形！

尽量避免使用`$attrs`来实现组件间通信，你可以使用`EventBus`或`Provide\Inject`等来实现同等需求！

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

额外添加一个包含`inheritAttrs`且默认导出的`script`，若使用了`typescript`，还需设置`lang`属性以避免报错：

```vue
<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
</script>
```

参考资料：[与普通的\<script\>一起使用](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E4%B8%8E%E6%99%AE%E9%80%9A%E7%9A%84-script-%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8)

### 多节点的attribute绑定问题

`Vue3`支持自定义组件可以有多个根节点，那这种情况就无法判断传入的属性（attributes）要绑定到哪里，需要自己手动指定绑定位置：

```vue
<!-- Father.vue -->
<Child @click="handleChange" />
```

```vue {4}
<!-- Child.vue -->
<template>
  <header>header</header>
  <main v-bind="$attrs">main</main>
  <footer>footer</footer>
</template>
```

未手动指定将报以下警告提醒：

```text
[Vue warn]: Extraneous non-emits event listeners (click) were passed to 
component but could not be automatically inherited because component renders
fragment or text root nodes. If the listener is intended to be a component 
custom event listener only, declare it using the "emits" option. 
at <Child onClick=fn<bound handleChange> > at <App> 
```

参考资料：[多个根节点上的Attribute继承](https://v3.cn.vuejs.org/guide/component-attrs.html#%E5%A4%9A%E4%B8%AA%E6%A0%B9%E8%8A%82%E7%82%B9%E4%B8%8A%E7%9A%84-attribute-%E7%BB%A7%E6%89%BF)

### 自定义组件在emits声明事件

Vue3的设计中，所有的属性传入后都通过`$attrs`来获取，但有一个例外，在`emits`选项中声明过的事件将被排除在外，事件可以继续通过`$emit('eventName',value)`来进行通信！

其实这里涵盖了两个传递流程：

1. 由外到内：外部属性（attributes）传入子组件；
2. 由内到外：自定义组件内部定义要和外部通信的事件名并与外部通信；

开发时最好秉承这个思想，最好不要将用于事件通信的名称跟着`$attrs`到处传递，除非你想使用之前介绍的[黑魔法](./$attrs.md#多级组件间通信)。这就像是组件内部不要修改传入的`props`，即使你有手段做到这一点！

官方也给到了这份建议：**建议定义所有发出的事件，以便更好地记录组件应该如何工作。**

看个例子：

```vue
<!-- 引用自vue官方 -->
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // 不声明事件
}
</script>
```

谨记：所有的属性都会在没有配置`inheritAttrs: false`选项时被默认绑定根元素。

若未配置`inheritAttrs`且`emits`未声明的结果就是一次`emit('click',$event)`产生两次`click`调用，这是非预期的！

或许你会觉得，配置了`inheritAttrs: false`不就可以解决这个问题了吗？是的，这可以解决，但违背了上述的思想，大家都本应各司其职，分工协作！下面我将通过另外一个例子来讲解这个过程：

```vue
<!-- Father.vue -->
<template>
  <div>
    <Child
      v-model="show"
      :style="customStyle"
      size="large"
      @mouseover="handleMouseOver"
      @change="handleChange"
    />
  </div>
</template>

<script>
import Child from "./components/Child.vue";
export default {
  name: "App",
  components: {
    Child,
  },
  data() {
    return {
      show: false,
      customStyle: {
        color: "skyblue",
      },
    };
  },
  methods: {
    handleChange(v) {
      console.log("get change", v);
    },
    handleMouseOver() {
      this.customStyle.color = "pink";
    },
  },
};
</script>
```

```vue
<!-- Child.vue -->
<template>
  <div class="date-picker">
    <h2 v-bind="rest" @click="handClick">toggle popover</h2>
    <p :class="[size]">hello world!</p>
    <Popover v-if="modelValue" />
    <button @click="handleChange">use change</button>
  </div>
</template>

<script>
import Popover from "./Popover.vue";
export default {
  inheritAttrs: false,
  emits: ["change"],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Popover,
  },
  setup(props, context) {
    const { size, ...rest } = context.attrs;
    return { size, rest };
  },
  methods: {
    handClick() {
      this.$emit("update:modelValue", !this.modelValue);
    },
    handleChange() {
      this.$emit("change", 1000);
    },
  },
};
</script>

<style scoped>
.date-picker p.large {
  font-size: 24px;
}
</style>
```

参考资料：[Vue3 emits](https://v3.cn.vuejs.org/guide/migration/emits-option.html#%E7%A4%BA%E4%BE%8B)
