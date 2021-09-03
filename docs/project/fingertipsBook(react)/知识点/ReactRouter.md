# ReactRouter

`import {} from "react-router-dom` 所需要的内容均从`react-router-dom`导出。

## HashRouter

使用`HashRouter`使路由方式变为hash路由，默认为`history`:

```tsx {2}
// 部分代码
<HashRouter>
  <Switch>
    <Route path="/child">
      <child />
    </Route>
  </Switch>
</HashRouter>
```

## 路由严格匹配

在`Route`组件上使用`exact`属性:

```tsx {4}
// 部分代码
<HashRouter>
  <Switch>
    <Route path="/child" exact>
      <child />
    </Route>
  </Switch>
</HashRouter>
```

## 404页面

用一个通配符`*`作为`Route`的`path`，然后将这个`Route`放在所有Route的最后。在其他所有路由都未匹配到时，则用`<NoMatch />`组件展示。

```tsx {9}
<Router>
  <Switch>
    <Route path="/a" exact>
      <Labels />
    </Route>
    <Route path="/b/c" exact>
      <Label />
    </Route>
    <Route path="*">
      <NoMatch />
    </Route>
  </Switch>
</Router>
```

## 获取地址栏的参数数据

利用从ReactRouter中提供的hook函数`useParams`可便捷获取地址栏参数。

```tsx
// 部分代码
import { useParams } from "react-router-dom";

let {id} = useParams();
```

`useParams` 默认导出类型是any，但通常来说，从地址栏获取的params都是`string`类型的。而且为了和动态路由参数名匹配，可以使用和动态路由参数名相同的名称来作为类型的名字。这样在导出使用时可以防止名称写错！

```tsx {4-6,9}
// 部分代码
import { useParams } from "react-router-dom";

type Params = {
  id: string
}

const Label: React.FC = () => {
  let {id} = useParams<Params>();
};
```
