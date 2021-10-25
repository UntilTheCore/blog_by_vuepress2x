# vue3的v-model

## 回顾v2版`v-model`双向绑定

```vue
<!-- ./components/CustomComponent.vue -->
<template>
  <button @click="change">use 100</button>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    change() {
      this.$emit("input", this.value - 100);
    },
  },
};
</script>
```

外部使用：

```vue
<!-- money = $event 不能省略为只有 money -->
<Custom :value="money" @input="money = $event" />
```

v-model就是默认`value`+`@input`的语法糖：

```vue
<Custom v-model="money" />
```

### 修改v-model的默认绑定

从`v2.2`起，新增了组件内的`model`选项，以支持硬编码的绑定`value`+`input`改为其他名字，这样做的好处是将`value`释放出来移作他用：

```vue {3-6,19}
<script>
export default {
  model: {
    prop: 'money',
    event: 'change'
  },
  props: {
    // 这将允许 `value` 属性用于其他用途
    value: String,
    // 使用 `money` 代替 `value` 作为 model 的 prop
    money: {
      type: Number,
      default: 0
    }
  },
  methods: {
    change() {
      // 触发model绑定的新的名为 change 的事件
      this.$emit("change", this.money - 100)
    }
  }
}
</script>
```

外部使用：

```vue
<!-- money = $event 不能省略为只有 money -->
<Custom :money="money" @change="money = $event" />
```

此时的v-model就是默认`money`+`@change`的语法糖：

```vue
<Custom v-model="money" />
```

### 多props的双向绑定(.sync)

由于`v2`版对`v-model`的硬编码性，无法做到使用`v-model`来对多个`props`实现双向数据绑定。因此在`v2.0`时加入了`.sync`修饰符来辅助达到同样（双向绑定）的效果！

```vue
<template>
  <div>
    <button @click="changeMoney">use 100</button>
    <button @click="changeAge">age + 1</button>
  </div>
</template>

<script>
export default {
  model: {
    prop: "money",
    event: "change",
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    money: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    changeMoney() {
      this.$emit("change", this.money - 100);
    },
    changeAge() {
      // 若期望使用 .sync 来优化外部用法，这里的 changeAge 需要改为和 props 名 age 一致
      // 即为 update:age （要双向绑定谁 就 update: 谁）
      this.$emit("update:changeAge", this.age + 1);
    },
  },
};
</script>
```

外部使用：

```vue
<Custom v-model="money" :age="age" @update:changeAge="age = $event" />
```

使用`.sync`简化代码：

```vue
<Custom v-model="money" :age.sync="age" />
```

它是下列语法的语法糖：

```vue
<Custom v-model="money" :age="age" @update:age="age = $event" />
```

## 破坏性更新

### 默认value和input名称更改

默认的`props`和事件名更改：

`value` => `modelValue`;

`input` => `update: modelValue`;

这番调整等于是把v2中的`value`和`input`的硬绑定取消了，并将默认`v-model`的绑定方式以类似`.sync`的需求格式进行绑定。这样做的好处是默认的`modelValue`和其余自定义`props`是同级的了，只是v3中直接使用`v-model`所表示的就是`v-model:modelValue`。

### 移除了`.sync`修饰符和`model`组件选项

v3中的`v-model`支持多个`props`的绑定，且书写和阅读更为友好。因此，这两项（.sync、model）被淘汰了。

## v3新增的内容

### 支持多个v-model

是的，现在支持在自定义组件上写多个`v-model`了，这主要是为了优化曾经实现相同功能`v-bind.sync`的解决方案。

之前v2时默认使用`value`属性+`input`事件来实现的`v-model`，现在它们改名为：`modelValue`+`update:modelValue`;

```vue {12,16,23,26}
<!-- ./components/Custom.vue -->
<template>
  <div>
    <button @click="changeModelValue">use 100</button>
    <button @click="changeAge">age + 1</button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    changeModelValue() {
      this.$emit("update:modelValue", this.modelValue - 100);
    },
    changeAge() {
      this.$emit("update:age", this.age + 1);
    },
  },
};
</script>
```

外部使用：

```vue {4-7}
<template>
  <div>
    <Custom
      :modelValue="money"
      @update:modelValue="money = $event"
      :age="age"
      @update:age="age = $event"
    />
    <p>father have {{ money }}</p>
    <p>father age {{ age }}</p>
  </div>
</template>

<script>
import Custom from "./components/Custom.vue";
export default {
  components: {
    Custom,
  },
  data() {
    return {
      money: 1000,
      age: 30,
    };
  },
};
</script>
```

`v-model`语法糖写法：

```vue
<Custom v-model="money" v-model:age="age" />
```

### 自定义修饰符

v3开放了`v-model`修饰符自定义的能力，因此可以做到更多个性化内容定制。

自定义修饰符的方法非常简单：

1. 在自定义组件内部的`props`内定义一个预获得修饰符的`props name` + `Modifiers`的`props`。注意：
    - 被修饰的`props`本身是双向绑定的，普通`props`不行；
    - 默认的`modelValue`不用写成`modelValueModifiers`，这样即可：`modelModifiers`；
2. 在外部使用时，对`v-model`的值后加`.xxx`，`xxx`表示自己自定义的修饰符名称。自定义组件内部会在`created`生命周期以后尝试获取并存入`xxxModifiers`内，其值被设置时为`true`，未设置时为`undefined`。内部则可根据`xxxModifiers`的`bool`状态执行处理逻辑。

```vue {12,13,16,17}
<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
      default: 0,
    },
    modelModifiers: { default: () => ({}) },
    ageModifiers: { default: () => ({}) },
  },
  created() {
    console.log(this.modelModifiers.yyy);
    console.log(this.ageModifiers.xxx);
  },
};
</script>
```

使用方式：

```vue
<Custom v-model="money" v-model:age.xxx="age" />
<!-- 
此时created中的结果：
created() {
  console.log(this.modelModifiers.yyy);  // false
  console.log(this.ageModifiers.xxx);    // true
},
-->
```

参考资料：[v3 v-model](https://v3.cn.vuejs.org/guide/migration/v-model.html#v-model)、[v-model自定义修饰符](https://v3.cn.vuejs.org/guide/component-custom-events.html#%E5%A4%84%E7%90%86-v-model-%E4%BF%AE%E9%A5%B0%E7%AC%A6)
