# TreeShaking

Tree Shaking 的作用是进行摇树优化，将被分析为不被使用的代码进行移除，优化文件体积。原理是利用ES6的`import`进行静态代码分析，因此，使用`require`方式进行动态引入的模块将无法被有效分析，tree shaking
无法生效。

**副作用**

有一些代码，是在 import 时执行了一些行为，这些行为不一定和任何导出相关。例如 polyfill ，polyfill 通常是在项目中全局引用，而不是在 index.js 中使用导入的方式引用。 Tree Shaking
并不能自动判断哪些脚本是副作用，因此手动指定它们非常重要。
