# mobx对多store进行状态管理

当我们需要对mobx多个store进行状态管理时，会将多个store引入到一个管理文件（index)后进行处理后导出。但有一个问题是如何将这些store导出后被全局使用并保持数据对象的引用呢？

- 使用[Context](https://react.docschina.org/docs/context.html) (Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据) 使用`React.createContext`创建一个用于全局访问的容器。根据React官方描述：“只有当组件所处的树中没有匹配到 Provider 时，其`defaultValue`参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。”根据这些内容，想要实现全局数据共享，可以通过`Context`实现，这也在Mobx官方中有所描述-[组合多个stores](https://zh.mobx.js.org/defining-data-stores.html#%E7%BB%84%E5%90%88%E5%A4%9A%E4%B8%AA-stores)
- 通过`React.createContext`创建的`Context`在组件中需要通过`useContext`来获取。而`useContext`中的参数必须是通过`createContext`创建出的值。那么又有一个新的问题出现，如果保证`useContext`时是同一个`Context`:

  - 将集合store对象导出，之后再需要使用的地方引入并放入`useContext`中;
  - 在集合store对象文件内导出一个自定义hook => useStores，函数内调用`useContext`并将集合store对象作为参数传入。这样即利用闭包机制将数据对象保持唯一！

**示例代码**

```tsx
import { createContext, useContext } from "react";
import authStore from "store/auth";
import userStore from "store/user";
import imageStore from "store/image";
import historyStore from "store/history";

const context = createContext({
  AuthStore: authStore,
  userStore,
  imageStore,
  historyStore,
});

// store 内容数据附加到 window 上进行数据查看和跟踪
(window as any).store = {
  AuthStore: authStore,
  userStore,
  imageStore,
  historyStore,
};

// 通过闭包，扩大context的作用域。从而避免组件中使用context.Provider
// 另外，根据官方说明：只有当组件所处的树中没有匹配到 Provider 时，
// 其 defaultValue 参数才会生效。这也是为什么不在<App />组件外部用context.Provider包裹的原因，
// 由于defaultValue就是被Mobx管理的数据，且调用了 useContext 的组件总会在 context 值变化时重新渲染
// 这样就实现了响应式的渲染，即使React的组件本身并不清楚状态的改变，但React会触发UI的重新渲染！
export const useStores = () => useContext(context);
```

React的devtools并不像vue可以查看vuex内的状态，mobx的状态跟踪除了使用其他插件外，我们还可以将其挂在到`window`上然后在浏览器的控制台中输出。

