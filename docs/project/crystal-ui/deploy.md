# 部署

## 站点部署

```bash
#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
yarn build

# 进入构建文件夹
cd dist

git init
git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:UntilTheCore/crystal-ui-vite.git master:gh-pages

cd -
```

在项目根目录下创建 `deploy.sh` 并添加以上脚本命令。在需要打包构建时在 `shell` 终端上执行 `./deploy.sh` 实现自动化部署，完成后会自动部署在 `Github Pages`上。

## 组件库部署

组件库打包需要依赖 `rollup` ，为了方便使用，项目中将 `rollup` 作为项目开发依赖以方便随处使用而不用在全局安装一个 `Rollup` 。

除此之外，还需要安装这些相关插件来辅助打包过程：`rollup-plugin-esbuild` 、`rollup-plugin-scss` 、 `rollup-plugin-terser` 、`rollup-plugin-vue`

若是使用了 `scss` 的 `@use` 引用了相关模块，比如 `@use "sass:math"`，在打包时出现 ` @use rules must be written before any other rules. ` 的错误，则需要在 `package.json` 中添加这条命令来解决这个错误:

```json
  "resolutions": {
    "node-sass": "npm:sass@1.26.11"
  },
```

若依然无法解决问题，可以尝试降低 `rollup-plugin-scss` 的版本。

## 包发布

完成组件库的打包后就可以将其上传至 npm 供其他 `coder` 使用了。首先在 `package.json` 做一些简单配置：

```json
{
  // 包名
  "name": "vue-crystal-ui",
  // 包版本
  "version": "0.0.1",
  // 要上传的文件
  "files": [
    "dist/lib/*"
  ],
  // 包入口
  "main": "dist/lib/crystal.js",
  // 给打包工具使用的文件入口，没有就使用 main 字段配置的文件
  "module": "dist/lib/crystal.esm.js",
}
```

更新包版本除了手动改之外，还可以通过 ` npm version <major | minor | patch> ` 命令修改：

```bash
# 更新主版本
npm version major

# 更新次要版本
npm version minor

# 更新补丁
npm version patch
```

更新后package中的version也会同步更新，之后想要发布包就直接 npm publish 就可以了。
