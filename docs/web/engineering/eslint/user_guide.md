# 如何使用ESlint

## 1. 安装

安装之前:

1. 如果是一个全新项目，首先需要通过 `npm init` 或者 `yarn init` 命令来初始化一个 `package.json`;
2. 前往[官网](https://eslint.org/docs/user-guide/getting-started#installation-and-usage)确本机的 `node` 版本是否符合要求。

开始安装：

```bash
npm install eslint --save-dev

# or

yarn add eslint --dev
```

## 2.使用 ESlint 配置

开始使用 `ESLint` 配置前，需要使用一个官方的包 `@eslint/create-config` 来快速初始化一个 `ESLint` 的配置文件。

```bash
npm init @eslint/config

# or

yarn create @eslint/config
```

:::tip
你可能注意到，安装的时候和之前提到的包名不一样，少了一个 `create` ，这是包管理器的功能。若对这块内容不太了解的话，可以移步至[《npm init 和 yarn create》](/web/packagemanager/npm_init_yarn_create.md)。
:::

通过一个提问式的流程，我创建了一个可检测 `vue` 项目的 `ESLint` 配置。

```js
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:vue/essential", "standard"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["vue"],
    rules: {},
};
```

:::warning
提问式流程的最后一步，eslint 会询问是否使用 npm 来安装。若项目使用 `yarn` 来创建的话，你在选择否之后需要自己手动来安装相关的包或者 `eslint` 配置中所需的插件！否则在执行检查命令 `npx eslint src/**` 时控制台会看到警告提示。
:::

## 3.检查 ESLint 配置是否生效

```js
// 在 src 目录下创建 test.js
// 编写以下内容且不在文件末尾新建空行
var t = "123";
```

执行 `npx eslint src/**` 后可以看到如下提示警告信息，则配置生效了：

```text
D:\eslint\demo\src\view\hello.js
  1:1   warning  Unexpected var, use let or const instead  no-var
  1:5   error    't' is assigned a value but never used    no-unused-vars
  1:9   error    Strings must use singlequote              quotes
  1:14  error    Extra semicolon                           semi
```

## 4.vscode中配置ESLint检测

如果不配置ESLint的话，就需要每次要检测的时候执行一遍 `npx eslint xxx` ，这样非常麻烦，而且进行处理也不够及时。最好的办法就是将检测过程直接在代码编辑器中得以实现。

在 `webstorm` 中，这个功能是集成的。到了 `vscode` ，就需要自己在扩展库中安装一个 `ESlint` 的插件，安装完成后，它会先判断当前项目是否安装了 `eslint` ，没有就从全局安装包目录中找。找到后检测项目下是否有 `esconfig.*` 相关配置文件，然后根据此文件的配置来辅助 `eslint` 提示功能。

## 5.主要的配置项

对于大部分使用 `cli` 且使用了 `cli` 中提供的 `ESLint` 创建项目的开发者，主要可能会配置到的属性是：`env`、`global`、`rules`、`overrides`

### env

[env](https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments)：给 `ESLint` 检测时指定可能的运行环境，比如说不写 `env: { browser: true }`，那么代码中的 `window` 就会被认为一个不认识的变量，从而 `ESLint` 报错。

### global

[global](https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals)：有的变量是 `ESLint` 没有在 `env` 配置项中提供预设的，比如百度地图的 `BMap` 变量。不配置 `ESLint` 就不认识：

```js
module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    global: {
        BMap: "readonly"
    }
}
```

配置的 `global` 变量可设置三个值： `readonly（不允许被覆盖）` 、 `writable（可被覆盖）` 、`off（禁用）`。

### rules

[rules](https://eslint.org/docs/user-guide/configuring/rules)：通常来说，使用 cli 创建包含了 `ESLint` 的项目是官方已经配置好的规则，可以认为是官方认定的 **最佳** 配置实践，我们直接使用就可以了。但是有时候确实有自己额外细粒度的配置需求，则可以在这里配置相关具体规则，它们可以覆盖掉其他规则。

### overrides

[overrides](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-based-on-glob-patterns)：此项配置的作用是更进一步且更细粒度地对具体的目录或文件进行单独的 `Lint` 检测配置。`overrides` 的覆盖机制优先级是最高的。又此项配置是一个数组，因此根据配置顺序，数组后面的配置项优先级会高于前一项！

```js
module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ["plugin:vue/essential", "standard"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: ["vue"],
    rules: {
        indent: ["error", 4],
        quotes: ["error", "double"]
    },
    overrides: [
        {
            files: ["bin/*.js", "lib/*.js"],
            excludedFiles: "*.test.js",
            rules: {
                quotes: ["error", "single"]
            }
        }
    ]
}
```

![eslint_overrides.png](https://s2.loli.net/2022/04/26/BCPErLH4ukpgwzY.png)

观察代码和图，`overrides` 会额外对 `bin` 和 `lib` 这两个目录使用新的 `rules` 进行 `lint` ，且会排除名为 `*.test.js` 的文件。
