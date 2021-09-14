# Mobx初探

## 初始化容器仓库

容器仓库推荐使用类来创建，当然也可以使用工厂函数、普通对象、数组、类、循环数据结构或引用。这与MobX的工作方式无关。只要确保所有你想随时间改变的属性都被标记为`observable`，这样MobX就可以跟踪它们:

:::: code-group

::: code-group-item makeObservable

```tsx
import { observabel, action, computed, makeObservable } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeObsevabel(this,{
      count: observabel,
      increment: action,
      getCount: computed
    });
  }

  get getCount() {
    return this.count;
  }
  
  increment() {
    this.count++;
  }
}
```

:::

::: code-group-item makeAutoObservable

```tsx
import { makeAutoObservable } from "mobx";

class Store {
  count = 0;

  constructor() {
    /**
     * makeAutoObservable自动推断所有属性
     * 
     * 可以显示的给第二个参数配置属性的观察性，false表示不观察
     * makeAutoObservable(this,{count: false})
    */
    makeAutoObservable(this);
  }

  get getCount() {
    return this.count;
  }
  
  increment() {
    this.count++;
  }
}
```

:::

::: code-group-item decorators + makeObservable

```tsx
import { observabel, action, makeObservable } from "mobx";

class Store {
  @observabel
  count = 0;

  constructor() {
    /* 
    * 在 6.x 之后，为了让装饰器的实现更简单以及保证装饰器的兼容性，
    * 必须在构造函数中调用makeObservable(this)。
    * Mobx可以根据 makeObservable第二个参数提供的装饰器信息，将实例设置为observable。
    * 鉴于此，简洁性还不如只使用 makeObservable
    * 
    * 如果给 makeObservable 设置第二个参数（即给属性方法设置注解），
    * 那么配置的装饰器将被忽略，除非为类内的属性和方法配置对应的注解！
    */ 
    makeObsevabel(this);
  }
  
  @action.bound
  increment() {
    this.count++;
  }
}
```

:::

::: code-group-item factory + makeAutoObservable

```tsx
import { makeObservable } from "mobx";

// 使用工厂函数创建观察数据
function createDoubler(value) {
    return makeAutoObservable({
        count,
        get count() {
            return this.count * 2
        },
        increment() {
            this.count++
        }
    })
}
```

:::
::::

`makeObservabel`和`makeAutoObservable`会有一些局限性，[点此了解详情](https://zh.mobx.js.org/observable-state.html#%E5%B1%80%E9%99%90%E6%80%A7)。

这两个函数还支持第三个参数[options](https://zh.mobx.js.org/observable-state.html#%E5%B1%80%E9%99%90%E6%80%A7)，可以配置观察属性和事件响应方法的默认行为，通常保持默认即可！

## 使用容器状态并用action修改状态

:::: code-group

::: code-group-item Function Component

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { makeAutoObervabel } from 'mobx';
import { observer } from 'mobx-react-lite';

class Store {
  count = 0;
  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

const App: React.FC<{store: Store}> = observer( (props) => (
  <div>
    <h1>{props.store.count}</h1>
    <button onClick={() => props.store.increment()} >+1</button>
  </div>
))

const store = new Store();

ReactDOM.render(<App store={store} />, document.getElementById('#root'));
```

:::

::: code-group-item Class Component

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { makeAutoObervabel } from 'mobx';
// 使用类组件要使用 mobx-react 
import { observer } from 'mobx-react';

class Store {
  count = 0;
  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

type Props = {
  store: Store
}

@observer
class App extends React.components<Props> {
  render() {
    const {store} = this.props;
    return (
      <div>
          <h1>{store.count}</h1>
          <button onClick={() => store.increment()} >+1</button>
      </div>
    );
  }
}

const store = new Store();

ReactDOM.render(<App store={store} />, document.getElementById('#root'));
```

:::

::::
