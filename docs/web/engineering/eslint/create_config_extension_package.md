# 「手摸手」创建config扩展包

> config 扩展包为提供给 .eslintrc.* 文件中 extends 属性的包。

本文将以配置实现对 `vue` 和 `typescript` 文件的检查作为案例展开介绍，基本上跟着操作（看）一遍就能轻松学会！

## 基础配置和测试

### 包初始化

首先找到一个空文件夹，并在此使用 `npm init -y` 或者 `yarn init -y` （以下都用 `yarn` 来进行包管理）来初始化一个 `pakcage.json` 文件。初始化完成后，需要做以下几步：

1. 安装 `eslint`：`yarn add eslint -D` ；
2. 在项目根目录创建一个 `index.js` 的文件（也可以使用自己喜欢的名称作为配置文件名）；

注意：不需要使用 `@eslint/create-config` 来创建和初始化一个 `.eslintrc.js` 的文件，因为我们不是要给当前项目创建 `eslint` 配置。

### 编辑 index.js

`index.js` 文件中只编写 `env` 和 `rules` 配置，甚至 `env` 也可以不要，只要一个 `rules`：

```js
// index.js
module.exports = {
    env: {
        // 识别 es6 环境
        "es6": true,
        // 识别 浏览器环境
        "browser": true,
        // 识别 node 环境
        "node": true,
    },
    rules: {
        // 禁止未使用的变量
        "no-unused-vars": ["error"],
        // 禁止对 const 变量进行赋值操作
        "no-const-assign": ["error"],
    },
}
```

### 基础配置测试

完成最简单的配置后，应立即进行测试，看看配置是否有效，步骤如下：

1. 在项目根目录中创建一个 `test` 文件夹；
2. 在 `test` 文件夹内创建 `.eslintrc.js` 文件；
3. 将 `index.js` 配置到步骤2的 `.eslintrc.js -> extends`中；
4. 在 `test` 文件夹内创建 `demo.js` 编写代码测试；
5. 使用 `npx eslint test/**` 命令查看检查结果；

`.eslintrc.js` 文件配置如下：

```js
// test/.eslintrc.js 
module.exports = {
    // 将此配置文件作为当前目录下的根配置文件
    root: true,
    // 接受的扩展配置文件路径（包名）
    extends: ["../index.js"],
}
```

`demo.js` 中编写测试代码：

```js
// test/demo.js
const a = 1;
a = 2;
```

运行 `eslint` 检查命令：

```bash
npx eslint test/**
```

基于 `index.js` 中配置的 `rules` ，我们执行命令后，可以得到这个结果：

![基础案例测试](https://s2.loli.net/2022/05/06/huQ2wjd3fGPikOx.png)

:::tip
如果使用了 `vscode` 或者 `webstorm` 则可以在没有执行命令情况下得到 `lint` 提示。不过对于 `vscode` 需要安装一个 `eslint` 插件，且在确认配置生效且其未出现提示时，尝试重新打开文件或者完全重启一次 `vscode` 。
:::

## 配置进阶和测试

`eslint` 默认只认识 `.js` 的文件，那么其他的文件比如 `.vue` 、`.ts` 如何实现识别和检测呢？且看下面的进阶配置。

### 识别 .vue 文件

安装 [eslint-plugin-vue](https://eslint.vuejs.org/user-guide/#installation):

```bash
yarn add eslint-plugin-vue -D
```

在 `index.js` 中配置 `eslint-plugin-vue` ：

```js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended', // vue3.x 检查
    // 'plugin:vue/recommended' // vue2.x 就用这个
  ],
}
```

可能注意到没有使用 `plugins` 配置项，因此此处是用的插件内的 `configs`，这样的方式可以简化一些书写，但是通常我们还有可能使用插件内的其他功能，所以最好还是将插件属性配置上：

```js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended', // vue3.x 检查
    // 'plugin:vue/recommended' // vue2.x 就用这个
  ],
  plugins: ["vue",]
}
```

完成配置后，在 `test` 目录中创建一个 `vue` 目录并在其内创建 `index.vue` 文件：

```vue
// test/vue/index.vue
<template>
  <div>
    <span v-for="a in arr">{{ a }}</span>
  </div>
</template>

<script>
const a = 1;
a = 1;
console.log(a);
export default {
  name: 'Todo',
  data() {
    return {
      arr: [1, 2, 3],
    };
  },
};
</script>

<style>
</style>
```

运行 `npx eslint test/**` 会发现检测失败，被提示无法匹配到规则，那是因为 `eslint` 默认只识别 `.js` 文件，其他文件后缀需要我们手动来指定： `npx eslint test/** --ext .vue` ，使用这条命令即可得到对 `.vue` 文件正确的检测能力。

### 识别 .ts 文件

要实现对 `.ts` 文件的识别，有三个重要的包必须安装：`typescript`、`@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin`，且最后一个依赖于前面的两个包。

安装完成后，继续在 `index.js` 文件中配置：

```js {8-17}
// index.js
module.exports = {
    env: {
        "es6": true,
        "browser": true,
        "node": true,
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
    ],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        "parser": "@typescript-eslint/parser",
        "ecmaVersion": 2019,
        "sourceType": "module",
    },
    rules: {
        "no-unused-vars": ["error"],
        "no-const-assign": ["error"],
    },
}
```

这里多了一个 `parserOptions` ，这是因为不管是 `.vue` 还是 `.ts` 文件，它们都需要被额外的解析引擎去正确解析文件内容。这些解析引擎都由这个官方所提供。

若只配置 `ts` 相关插件的话，只用配置 `parser` 属性就可以了，`eslint` 就会将相关文件交给新的 `parser` 去解析文件，但是此处不仅有 `ts` ，还有 `vue` ，多个文件需要解析的情况下，就需要像漏斗一样，每个解析引擎处理好了，再交给下一个去处理。

于是就要靠 `parserOptions` 来传递这些解析所需的配置。当我们阅读源码，会知道这份配置文件会首先加载 `vue` 的 `parser` ，于是 `parserOptions` 会先传递给 `vue parser`，它会处理 `.vue` 后缀文件，`.ts` 文件不认识，再把解析权交给 `ts parser` 去解析。直到所有文件检查完成。

#### 配置 tsconfig.json

以上是对 `index.js` 文件的介绍，对于 `typescript` 来说，让它正常运行起来的前提是还需要有一个 `tsconfig.json` 文件，没有这份文件则 `typescript` 运行报错！

因此，我们还需要在 `test` 目录内创建一个 `tsconfig.json`：

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "jsx": "preserve",
        "importHelpers": true,
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "sourceMap": true,
        "baseUrl": ".",
        "lib": [
            "esnext",
            "dom",
            "dom.iterable",
            "scripthost"
        ]
    },
    "include": [
        "**/*.ts",
        "**/*.tsx",
        "**/*.vue"
    ],
    "exclude": [
        "node_modules"
    ]
}
```

### 引入扩展检测

这些对特殊文件检查的配置已经完成了，现在我们需要 `.js` 文件再来配置一番。但不可能所有的 `rule` 都由我们自己来编写，因此可以借助官方提供的标准配置包，引入后再覆盖一些定制化的规则即可。

首先回到项目根目录，安装这些包（需要注意版本的一致性，若是最新安装那直接装 latest 即可）：

```bash
yarn add -D eslint-config-standard@latest eslint-plugin-import@latest eslint-plugin-n@latest eslint-plugin-promise@latest
```

配置 `index.js`：

```js {3}
module.exports = {
    extends: [
        "standard",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
    ],
}
```

若依赖包安装不全，则运行时会收到 `eslint` 依赖安装提示！

### 进阶配置测试

完成以上操作后，执行命令 `npx eslint test/** --ext .vue,.ts` 查看运行结果，是否所有文件都被正确检测到了呢？