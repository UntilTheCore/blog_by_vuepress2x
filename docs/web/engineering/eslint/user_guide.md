# 「轻松搞懂」ESLint

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

## 6.不太常用的配置项

### extends

[extends](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files)：这是一个继承属性，可以继承另外一个配置文件的 **所有** 属性（注意：是所有）。它的配置值可以是一个单字符串，也可以是一个字符串数组，如果是一个字符串数组，那么数组后面的配置会 **扩展** 前一个的配置。等于最终是以最后一个配置文件为准。

需要注意的是，这些扩展配置有一个潜在的规则：

1. **规则合并：** 如果后一个配置只是对前一个规则的严重程度进行了更多，那么就触发规则合并：

```text
前一个:    "eqeqeq": ["error", "allow-null"]
当前:      "eqeqeq": "warn"
最终结果:   "eqeqeq": ["warn", "allow-null"]
```

2.**规则覆盖：** 如果后一个配置既更改了严重程度，又更改了规则，那么就触发覆盖：

```text
前一个:     "quotes": ["error", "single", "avoid-escape"]
当前:       "quotes": ["error", "single"]
最终结果:    "quotes": ["error", "single"]
```

一些特殊规则是一个对象值，那就把新对象内属性覆盖上一个对象，并把没有配置到的属性值置位默认值：

```text
前一个:   "max-lines": ["error", { "max": 200, "skipBlankLines": true, "skipComments": true }]
当前:     "max-lines": ["error", { "max": 100 }]
最终结果:  "max-lines": ["error", { "max": 200, "skipBlankLines": false, "skipComments": false }]
```

#### extends文件引入的规则

为了简化书写，可以在填写 `extends` 内配置文件时忽略 `eslint-config-` 前缀。比如：

```js
 extends: ["eslint-config-standard"]
 //可以简化为 
 extends: ["standard"]
```

对于 `scope` 包，也是同理，只不过是忽略 `/` 后的 `eslint-config-` 前缀：

```js
 extends: ["@vue/eslint-config-prettier"]
 //可以简化为 
 extends: ["@vue/prettier"]
```

### plugins

ESLint 中的插件是为了增强其功能的存在。官方只提供了对 `.js` 文件的 `lint` 能力，而对于其他文件无能为力。比如 `.vue` 、`.jsx` 等文件，这些文件的检测能力，都是靠这些应用技术的官方提供的。

对于大多数开发者，基本不会去编写这方面的插件，除非要自己定义一种文件格式！通常来说，我们只要会 **引入** 插件，会 **使用** 插件提供的配置，会 **覆盖** 插件中的具体配置项即可！此时我们就需要前往提供插件的官方文档去查看如何使用相关配置了，比如 [eslint-plugin-vue](https://eslint.vuejs.org/user-guide/#installation) 的 `ESLint` 配置官方文档。

关于 `plugins` 内还有一些更为高级的配置项，属于小众的配置，这里就不再展开介绍了，有兴趣可以看我的这篇文章[《ESlint进阶配置指南》](/web/engineering/eslint/eslint_advanced.md)。

#### plugins文件引入的规则

为了简化书写，可以在填写 `plugins` 内配置文件时忽略 `eslint-plugins-` 前缀。比如：

```js
 plugins: ["eslint-plugins-vue"]
 //可以简化为 
 plugins: ["vue"]
```

对于 `scope` 包，也是同理，只不过是忽略 `/` 后的 `eslint-plugins-` 前缀（这种方式很少见）：

```js
 plugins: ["@vue/eslint-plugins-vue"]
 //可以简化为 
 plugins: ["@vue/vue"]
```

[命名约定参考](https://eslint.org/docs/user-guide/configuring/plugins#naming-convention)

## 总结

1. `extends` 和 `plugins` 若使用第三方的包，则必须先进行安装；
2. `extends` 和 `plugins` 的作用都是为了更好地配置项目。`extends` 主要作用就是进行配置合并（或覆盖），而 `plugins` 除了提供一些配置外还可以增强文件文件的解析，用来处理 `ESLint` 所无法识别的文件，比如 `.vue` 、`.jsx` 、`.ts` 、`.tsx` 文件。
3. 配置文件配置的最终应用路线： overrides > rules > extends；

## 注意

1. 当一个项目中有多个 `eslintrc.js` 或 `eslintrc.json` 时，子目录中的 `eslintrc.js` 若不配置 `root:true` 的话，它会被配置了此项属性的文件或是最终找到的顶层 `eslintrc.js` 文件中的配置所覆盖。因此若想每个文件都可以得到正确应用，则需给配置文件配置 `root: true` 属性；
