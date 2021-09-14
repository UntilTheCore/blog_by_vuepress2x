# 异步action

一些情况下，我们需要在`action`内执行异步操作，而直接在`action`中执行异步代码是不被允许的。但有三种方式可以实现：

## 1. 在异步代码块中调用另一个action

```tsx {17}
import { makeAutoObservable, action } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeAutoObsevable(this);
  }

  increment() {
    this.count++;
  }

  // 异步 action 执行同步 action
  asyncAction() {
    setTimeout(() => {
      this.increment();
    },100);
  }
}
```

## 2. 在异步action中创建并执行action

```tsx {17-19}
import { makeAutoObservable, action } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeAutoObsevable(this);
  }

  increment() {
    this.count++;
  }

  // 异步 action 执行同步 action
  asyncAction() {
    setTimeout(() => {
      action('newAction',() => {
        this.count++;
      })() // 要执行调用
    },100);
  }
}
```

## 3. 异步action中使用runInAction

```tsx {16-18}
import { makeAutoObservable, runInAction } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeAutoObsevable(this);
  }

  increment() {
    this.count++;
  }

  asyncAction() {
    setTimeout(() => {
      runInAction(() => {
        this.count++;
      })
    },100);
  }
}
```

使用`runInAction`相比用`action`创建一个函数更为简洁，但在逻辑更为复杂的情况下使用单独定义的`action`更为合适，即方式1。
