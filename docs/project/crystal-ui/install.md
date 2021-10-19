# 项目搭建以及配置

## 安装

### 1.项目初始化

进入待安装目录，运行以下命令并根据所需选择相应的模板进行安装。`Vite`不像`Vue cli`，并没有在项目初始化时同时初始化了`git`，我们需要自己手动执行`git init`来初始化存储库。

::::code-group
:::code-group-item yarn

```bash
# 1.使用vite创建项目
yarn create @vitejs/app
# 2.进入项目目录
cd your-project-folder
# 3.安装依赖，创建项目时并未同时完成依赖的安装
yarn install
# 4. 运行
yarn dev
```

:::

:::code-group-item npm

```bash
# 1.使用vite创建项目
npm init @vitejs/app
# 2.进入项目目录
cd your-project-folder
# 3.安装依赖，创建项目时并未同时完成依赖的安装
npm install
# 4. 运行
npm run dev
```

:::
::::

### 2.安装vue-router

直接执行`yarn add vue-router`默认安装的版本是3.x，而Vue3开始应结合[vue-router@4.x](https://router.vuejs.org/zh/guide/#html)使用。

```bash
# 查看 vue-router 的所有版本，安装最新或所需的版本。若已知版本则可忽略此步骤
yarn info vue-router versions
# 安装 vue-router
yarn add vue-router@4.0.12
```

### 3.安装sass

Vite项目默认开箱支持主流css预处理器，因此也不用烦恼配置`scss-loader`或`less-loader`，只需安装上预处理器即可。若对css预处理还不太了解的，可以忽略此步骤，只使用原生css即可。

```bash
# 安装 scss
yarn add -D sass
# 安装 less
yarn add -D less
```

## 配置

### 配置路径别名(alias)

配置`路径别名`，在含`webpack`的项目中，我们使用`@`来表示`src`目录，以此来操作其他`src`内的子目录，这样就不用写类似`../../../`这样的路径了，既不美观也容易搞错！

#### 配置vute.config.ts

在`Vite`项目中，需要在`vite.config.ts`或`vite.config.js`做如下配置：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

配置完成，项目在运行和构建打包时，即可正确找到对应的文件进行编译。当然，这个路径别名可以配置多个，比如`components: path.reoslve(__dirname,"src/components")`，这样在使用时可以使用`components/xxx`来代替`@/components/xxx`以此进一步简化书写。

#### 配置tsconfig.json

`tsconfig.json`的配置主要影响IDE的提示，未正确配置但又使用了别名，会影响IDE的路径查找，从而被提示`无法找到xxx模块`。

注：未配置lint情况下，IDE的提示并不会影响项目的构建运行。但做了lint的相关配置后，lint会报错并终止运行项目。

`tsconfig.json`关于路径别名的配置规则较为简单，只需关注`baseUrl`和`paths`这两项。通常`vite.config.ts`中`alias`怎么配置的，在`tsconfig.json`中原样迁移过来即可，这基本不会出错。

```json{14,17}
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    // 以当前目录为基准目录
    "baseUrl": ".",
    "paths": {
      // 以@来表示src目录
      "@/*": ["src/*"],
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

注：在`tsconfig.json => paths`中，一定要为配置的键值都额外加上`/*`（前提是你需要这个目录内的所有内容），否则IDE将无法实现正确的路径提示！不论`paths`还是`alias`都可以配置直接指向具体文件的路径，这就看各自需求了。另外，内为了保证特殊模块的访问，`paths`内可以配置多于`alias`的路径，只不过是`path`内有的，`alias`内也需要有！

参考资料：[模块解析](https://www.tslang.cn/docs/handbook/module-resolution.html#base-url)
