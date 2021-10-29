# 检查子组件的类型

在一些场景下，需要对组件嵌套组合使用，比如`Tabs`和`Tab`的组合。此时会牵涉出一些问题，`Tabs`组件不应该无条件接受外部传入内容进行渲染，应该判断内部组件的类型以符合所需。

## 获取slots的方式

### setup函数

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import Tab from './Tab.vue';

export default defineComponent({
  setup(props, context) {
    const { slots } = context;

    if (slots.default?.()) {
      slots.default().forEach((item, index) => {
        if (item.type !== Tab) {
          throw Error(`[Crystal error]: The element ${index} type is not Tab`)
        }
      })
    } else {
      throw Error("[Crystal error]: Tabs missing content")
    }
  }
})
</script>
```

默认导出的普通对象中的[组合式API setup](https://v3.cn.vuejs.org/api/composition-api.html#%E7%BB%84%E5%90%88%E5%BC%8F-api)并没有参数类型提示，想要对传递给 `setup()` 的参数进行类型推断，则必须使用`defineComponent`，使用普通的`export default {}`的方式将无法正确得类型判断，ts将会给出警告。

### \<script setup\>

```vue {11}
<!-- Tabs.vue -->
<script setup lang="ts">
import { useSlots } from 'vue';
import Tab from './Tab.vue';

const slots = useSlots();

if (slots.default?.()) {
  slots.default().forEach((slot, index) => {
    // 判断是否是 Tab 
    if (slot.type !== Tab) {
      // 使用 console.error 或 throw Error
      throw Error(`[Crystal error]: The element ${index} type is not Tab`)
    }
  })
} else {
  throw Error("[Crystal error]: Tabs missing content")
}
</script>
```

`slots.default?.()`使用的是[可选链操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)，判断是否传入了内容。

由于`useSlots`返回值的类型可能包含`undefined`，又可能因为没有给组件传入内容，因此`slots`本就不含有`default`方法，直接使用`slots.default()`会报错。这样的情况下我们需要对`slots`和`default`做判断来避免运行时错误和ts的警告。

```ts
if(slots && slots.default) {
  // ... 使用 slots.default()
}

// 使用可选链操作符简化写法
if (slots.default?.()) {}
```

### 如何判断类型

向`Tabs`传入的每个节点都将会成为`default`函数返回值（数组）的一部分，数组的每一项都有一个`type`属性，标记着这个节点的类型。它的值是个对象，如果是自定义组件，那么导入时的对象，就是这个`type`的内容，因此完全可以用来进行`===`相等判断！

参考资料：[组合式API](https://v3.cn.vuejs.org/api/composition-api.html#%E7%BB%84%E5%90%88%E5%BC%8F-api)、[defineComponent](https://v3.cn.vuejs.org/api/global-api.html#definecomponent)、[useSlots](https://v3.cn.vuejs.org/api/sfc-script-setup.html#useslots-%E5%92%8C-useattrs)、[插槽](https://v3.cn.vuejs.org/guide/render-function.html#%E6%8F%92%E6%A7%BD)、[可选链操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
