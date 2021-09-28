# Redux基础

Redux+typescript是官方也推荐的方式，此系列也将结合起来介绍。

## 安装

使用`create-react-app`安装并选装`redux`+`typescript`:

:::: code-group
::: code-group-item yarn

```bash
yarn create react-app redux-ts-demo --template redux-typescript
```

:::

:::code-group-item npm

```bash
npm init react-app redux-ts-demo --template redux-typescript
```

:::

:::code-group-item npx

```bash
npx create-react-app redux-ts-demo --template redux-typescript
```

:::
::::

初学时可以先忽略工程中原官方案例代码。在`src/index.ts`内完成基本内容的探索。

## redux的核心

`state`、`action`、`reducer`、`dispatch`、`Provider`、`subscribe`。其中`Provider`是`react-redux`包中提供的组件，用于连接`React组件`和`Redux Store`的通信。

`reducer`可以理解为事件管理者，`dispathch`则是事件通知者，`action`是触发的动作，`state`是状态的容器。这样看起来，`reducer`是一个核心成员，关于如何处理state的逻辑都在这里完成。


```tsx
import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

type Action = { type: "increment" }

// 1. 定义处理和响应"事件"的管理中心函数
function reducers(state = 0 /** 初始化 state 的值 */, action: Action) {
  const {type} = action;
  switch (type) {
    case "increment": 
      return state + 1;
    case "decrement": 
      return state -1;
    default: 
      return state;
  }
}

// 2. 创建 store
const store = createStore(reducers);

// 3. 获取state状态
console.log(store.getState());

// 4. 订阅 state 的改变
store.subscribe(() => {
  render();
})

const App: React.FC = () => {
  return (
    <>
      <p>{store.getState()}</p>
      <button onClick={() => store.dispatch({
        type: "increment",
      })}>increment</button>
      <button onClick={() => store.dispatch({
        type: "decrement"
      })}>decrement</button>
    </>
  )
}

// 5. 渲染UI
render();

function render() {
  ReactDOM.render(
    // 根组件连接，并关联 store 
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  )
}
```

此时的组件还不具有自动更新UI的能力，因此需要我们通过`render`函数并在`subscribe`监听到`state`发生变化时手动更新UI。

以上即为`Redux`运行的主要过程。

`createStore`在创建store时可以传入第二个参数，用于初始化`reducers`函数参数1`state`的值。当在`createStore`中传入初始值后，`reducers`内state的初始值就失效了！