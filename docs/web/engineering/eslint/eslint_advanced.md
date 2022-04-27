# ESLint 进阶指南

进阶指南主要针对的是 `plugins` 相关的内容，虽然大部分开发者是仅使用 `ESLint` 而不直接需要进行插件的编写，但了解相关的内容也会对阅读别人源码有所帮助。

## 配置项

### rules

> 插件中的 rules 就是创建自定义规则集。

插件中的 `rules` 定义方式和普通 `eslintrc.*` 的 `rules` 没什么太大区别，但插件中是制定规则内容的地方，你可以为规则起一个名字，然后在 `create` 方法内为这个规则编写判断逻辑：

```js
// eslint-plugin-myPlugin
module.exports = {
    rules: {
        "my-rules": {
            create: function (context) {
                // rule implementation ...
            }
        }
    }
};
```

在 `eslintrc.*` 文件中使用的使用，就需要通过插件名来引用此规则：

```js
module.exports = {
    rules: {
        "myplugin/my-rules": "error"
    }
};
```

### configs

插件中提供 `configs` 的目的主要还是用于扩展配置，一个官方提供的插件内往往提供了多个配置参考供开发者去配置自己的项目。

比如说，在自己的 `eslintrc.js` 文件内，我们非常容易就会看到一些配置：

```js
extends: ["plugin:vue/essential"]
```

这句配置的解释：使用 `eslint-plugin-vue` 插件内的名为 `essential` 的 `configs` 配置项，并启用里面 `rules` 规则。

`eslint-plugin-vue` 配置 `configs` 部分源码：

```js
configs: {
    base: require('./configs/base'),
    essential: require('./configs/essential'),
    'no-layout-rules': require('./configs/no-layout-rules'),
    recommended: require('./configs/recommended'),
    'strongly-recommended': require('./configs/strongly-recommended'),
    'vue3-essential': require('./configs/vue3-essential'),
    'vue3-recommended': require('./configs/vue3-recommended'),
    'vue3-strongly-recommended': require('./configs/vue3-strongly-recommended')
},
```

在 `configs` 中，不仅可以配置独属于当前 `configs` 名称的 `rules` ，还可以配置 `plugins` 、`env` 等。这里其实就等于一个非直接文件的 `eslintrc.*` 文件。

[官方内容介绍-Configs in Plugins](https://eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)

### environments

通过 `environments` 属性，可以为 `eslintrs.*` 文件内的 `env` 属性提供一个特有的环境。

这个属性用的不多，可以在[官方案例](https://eslint.org/docs/developer-guide/working-with-plugins#environments-in-plugins)中了解更多。

### processors

`processors` 在插件中具有举足轻重的作用，它的作用有多样 “处理器可以从其他类型的文件中提取 JavaScript 代码，然后让 ESLint 对 JavaScript 代码进行 lint，或者处理器可以出于某种目的在预处理中转换 JavaScript 代码。”

通常来说， `processor` 和 `overrides` 是一个固定搭配，我们可以在 `overrides` 中为指定的文件，例如 `.md` 文件指定处理器去处理其中的 `js` 文件：

```js
{
    "plugins": ["a-plugin"],
    "overrides": [
        {
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        }
    ]
}
```

根据上面的内容，可以了解到，这玩意儿好像还是有一些局限性，它能做的就是从非 `js` 文件中提取 `js` 代码。而要是我们想对一份自定义文件内所有内容都进行检测，此时就需要使用 `parser` 了。

[插件中的处理器](https://eslint.org/docs/developer-guide/working-with-plugins#processors-in-plugins)、[指定处理器](https://eslint.org/docs/user-guide/configuring/plugins#specifying-processor)

### parser

`parser` 的作用就是把非 `js` 自定义文件进行解析，使得解析后的内容可以被 `ESLint` 正确识别，然后交给插件的 `rules -> context` 去完成各个规则的制定工作，以及交给 `processors` 处理 `js` 的 `lint`。

要清楚的是，`parser` 本不是插件中必须拥有的一环，它是独立的。`parser` 属性可以出现在非插件的普通配置文件中！

#### parserOptions

`parserOptions` 解析配置，是用于 `parser` 解析时使用的，通常它俩都一起出现。本身 `parserOptions` 的内容是提供给 `ESLint -> Espree` 解析器的，但是一旦我们指定了额外的 `parser` 属性，那么 `parserOptions` 会先传给自定义的 `parser`，然后自定义 `parser` 处理后再传给 `Espree` 。

[使用自定义解析器](https://eslint.org/docs/developer-guide/working-with-custom-parsers)、[指定解析器](https://eslint.org/docs/user-guide/configuring/plugins#specifying-parser)、[ESLint 的 parser 是个什么东西](https://zhuanlan.zhihu.com/p/295291463)
