# SVG

使用svg的方式有三种：

1. 使用svg图片：即将svg的路径作为`img`标签的`src`,以此来使用svg

```javascript
// 以此方式引入为svg的路径，例如 /static/media/bill.4c359a03.svg
import x from 'icon/bill.svg'

// 使用 svg
const f = () => {
  return (
    <div>
      <img src={ x }/>
    </div>
  )
}
```

2. SVG Symbols: 使用`SVG Symbols`可以避免使用svg图片的问题，因为使用svg图片会使用到svg的地方总要使用`import`来引入一下svg，比较麻烦。

* 2.1 使用 [svg-sprite-loader](https://github.com/JetBrains/svg-sprite-loader) 和 svgo-loader 来辅助svg的引入：

::: tip

欲使用svg-sprite-loader前，需使用 `yarn eject` 指令将webpack配置释放出来。

:::

```bash
# 安装 svg-sprite-loader 和 svgo-loader
yarn add svg-sprite-loader svgo-loader -D

# svg-sprite-loader 内置了 svgo-loader 可以不再单独安装它
```

- 2.2 在 `webpack.config.js` 中配置 loader：

```javascript
// 其余相关配置不再此列出
module.exports = function (webpackEnv) {
  return {
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.svg$/,
              use: [
                { loader: 'svg-sprite-loader', option: {} },
                { loader: 'svg-loader', option: {} },
              ]
            }
          ]
        }
      ]
    }
  }
}
```

- 2.3 使用SVG Symbols：经过相应loader处理后，会把引入的SVG插入到页面的body中，使用时用对应的symbol id 即可。loader 会将svg的文件名作为id名。

```tsx
// import bill from 'icon/bill.svg'
require('icon/bill.svg');

const f = () => {
  return (
    <svg>
      <use xlinkHref={ '#bill' } />
    </svg>
  )
}
```

注意：这里不再使用`import` 进行导入操作了，因为如果没有在js代码中显示使用引入的内容，那么它将会被tree shaking。可以增加一个`console.log(bill)`，但显然这不美观！

3. 自动化整目录svg导入

```ts
// 引入整个存svg的目录
const importAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext);
try {
    importAll(require.context('icons', true, /\.svg$/));
} catch (error) {
    console.log('import all svg error!',error);
}
```

上述代码是webpack所提供的能力，[Webpack](https://webpack.docschina.org/guides/dependency-management/#requirecontext) 会在**构建中**解析代码中的`require.context()` (注：并非运行时)。在使用此代码时，在ts中可能会被提示无法解析类型`__WebpackModuleApi.RequireContext` ,此时可以安装`@types/webpack-env`解决。[此问题参考资料](https://stackoverflow.com/questions/40568176/webpack-typescript-module-hot-does-not-exist)

```bash
yarn add @types/webpack-env -D
```
