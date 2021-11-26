# vscode

## 配置别名路径跳转和组件跳转

一般的webpack项目默认是以`@`代表`/src`目录的。有时我们还需要在根目录下配置`jsconfig.json`或`tsconfg.json`来描述路径别名（vetur会扫描识别这些文件来提供路径参考），比如`nuxt`支持的路径别名有这些：

```json
// jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"],
      "~~/*": ["./*"],
      "@@/*": ["./*"]
    }
  },
  "exclude": ["node_modules", ".nuxt", "dist"]
}
```

一般cli工程都会提供相关信息以供IDE或插件正确识别路径以正确通过编译，而且还能为用户带来导入路径提示的能力。

但这些还不够，还是以`nuxt`工程为例，在vscode中无法正确识别路径关联，虽然编译没问题，导入的时候提示也没问题，但是当我们想要使用`Ctrl + v`或`F12`或`Ctrl + 鼠标左键`快速访问源文件的时候，就开始捉襟见肘了！

### 别名路径快捷跳转

想要在导入位置通过快捷键快速访问源文件需要安装一个插件,插件名为："别名路径跳转"。安装后在`settings.json`中新增如下配置：

```json
// settings.json
{
  "alias-skip.mappings": {
    "@": "/src",
    "~": "./",
  },
}
```

一般默认是以`@`表示`/src`目录，但在nuxt工程中，默认情况下相关页面和组件并没有在src目录下，所以在此新配置了一项`~`来表示相对路径下的所有文件。完成此项配置后重启vscode，再用快捷键点击导入路径，即可正确访问源文件了。

如果有更多别名需要配置，按照规则继续添加配置即可。

### 组件快捷跳转

vscode对`.vue`的支持并没有像`react`那么好，在`template`内想要点击组件就能跳转源文件在默认情况下也是无法实现的，在没有插件提供帮助的情况下，我就是用`Ctrl + p`来“快速访问“的。

想要实现点击组件跳转的能力，除了要安装`vetur`之外，还需安装`vue-helper`。安装完成后在插件的配置属性下完成自己所需的路径别名即可：

```json
// settings.json
{
  "vue-helper.alias": {
    "~": "."
  },
  "vue-helper.componentPrefix": {
    "alias": "~",
    "path": "."
  }
}
```

以上内容需根据自身需求配置，切不可直接完全照搬！

### Vue Volar Extention Pack

若使用了Vue3，官方指定推荐的vs插件是 `Volar` 。如果初次配置vscode，推荐直接搜索 `Vue Volar Extention Pack` 这个插件包，并按需安装里面推荐的插件，或者你也可以完全安装。使用Volar后，不仅可识别 `vue` 文件的导入，连 `template` 中的 `class` 也支持 `ctrl`+`鼠标左键` (F12)快速跳转！这更是增强了 `Vue3` 的
