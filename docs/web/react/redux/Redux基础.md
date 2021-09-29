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

## 拆分Reducers

上面的例子`state`只有一个`number`的状态值，通常的应用会有多个数据状态需要保存，而在拥有多个全局状态时，把处理逻辑都放到一个`reducer`中，那么在工程不断拓展后会使整个文件变得异常庞大使得难以阅读和维护！此时就需要将各个独立的状态操作放到一个单独的`reducer`中进行维护，通常会在项目根目录创建一个`reducers`目录来进行管理。

**创建userReducer：**

```tsx
// src/reducers/user.ts
import { AnyAction } from "redux";

export type UserState = {
  username: string,
  gender: number,
  age: number
}

export type UserAction = {type: "login" ,user: UserState}

const initUserState: UserState = {
  username: '',
  gender: 0,
  age: 0
}

const userReducer = (state: UserState = initUserState, action: AnyAction) => {
  const {type, user} = action as UserAction;
  switch(type) {
    case "login": 
      return {...state, ...user};
    default: 
      return state;
  }
}

export default userReducer;
```

**创建postReducer：**

```tsx
// src/reducers/post.ts
import { AnyAction } from "redux";

export type PostState = {
  id: string,
  title: string,
  content: string 
}

export type PostAction = {type: "add_post" , post: PostState}

const initPostState: PostState = {
  id: '',
  title: '',
  content: ''
}

const postReducer = (state: PostState = initPostState, action: AnyAction) => {
  const {type, post} = action as PostAction;
  switch(type) {
    case "add_post": 
      return {...state, ...post};
    default: 
      return state;
  }
}

export default postReducer;
```

**把子reducer合并到一个文件中：**

```tsx
// src/reducers/index.ts
import { post, PostState, PostAction } from "reducers/post";
import { user, UserAction, UserState } from "reducers/user";
import { combineReducers } from "redux";

export type RootAction = UserState | PostAction;

export type RootState = {
  user: UserState,
  post: PostState
};

const initState: RootState = {
  user: {
    username: '',
    gender: 0,
    age: 0
  },
  post: {
    id: '',
    title: '',
    content: ''
  }
};

export default function rootReducers(
  state: RootState = initState,
  action: RootAction
) {
  return {
    user: user(state.user, action),
    post: post(state.post, action)
  };
}

export const combineReducer = combineReducers({
  user,
  post,
});

```

在子`reducer`中，需导出当前`reducer`中`state`和`action`的类型，以供合并文件`reduders`内使用。并且子`reducer`函数参数2的`action`类型需设置为[anyAction](https://redux.js.org/usage/usage-with-typescript#type-checking-reducers)然后在使用时将其强转为本`reducer`的action的类型即可。

你可能会好奇为何不直接引入`RootAction`来作为子`reducer action`的类型，原因如下：

1. 为了使`dispatch`时可以明确载荷类型，不想所有的action除了`type`外都使用`payload`来作为载荷的键名!(如何你想这么做也不是不可以)。如果用`RootAction`那么将必须统一`action`的类型，比如是：`{type: string, payload: any}`

2. 将子`reducer`函数参数`action`设置为`anyAction`后，通过类型强转(`as`)可以将`action`的类型重新圈定回当前`reducer`中，在文件内编写代码时可以得到只包含当前`reducer`的类型提示。要是使用`RootAction`，那么类型就不再纯粹，将包含其他文件的`action`内容。

### 初始化`reducer`

细致的你可能已经注意到每个子`reducer`函数参数1`state`都被赋予了默认值，你是否疑问这是必须的吗？是的，这是必须的！

**请为`reducer`赋一个初始值！** 这非常重要，这在你使用`combineReducers`时是必须的！未进行初始化赋值，那么你的`state`将有可能是`undefined`，redux将会提示你这个错误，告诉你须提供一个初始值：

```text
Error: The slice reducer for key "post" returned undefined during initialization.
If the state passed to the reducer is undefined, you must explicitly return the 
initial state. The initial state may not be undefined. If you don't want to set a 
value for this reducer, you can use null instead of undefined.
```

`combineReducers`是一个辅助函数，帮助我们简化手动书写整合`reducers`的代码，当我们不使用`combineReducers`时，可以忽略在子`reducer`中初始化state，但也必须给`rootReducers`提供一个初始`state`。与其在`index.ts`中写，不如在子`reducer`中直接赋初始值更好，不仅自己管理自己的状态，还可以简化`index`中的代码！

## 每个应用程序只有一个 Redux Store

[每个应用程序只有一个 Redux Store](https://redux.js.org/style-guide/style-guide#only-one-redux-store-per-app)

通常的应用整个组件树都只需一个`store`，也仅是在`<App />`组件外用`<Provider>`进行包裹。建议是不要将`createStore`创建出的`store`进行导出，多处引入`store`将可能导致行为不可预测。为避免错误的发生，可以只在项目`src/index.tsx`内使用`createStore`。
