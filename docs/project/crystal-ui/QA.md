# 问题及参考解决方案

## Error: The package "esbuild-linux-64" could not be found, and is needed by esbuild

这个问题在[Vite issues](https://github.com/vitejs/vite/issues/5187)上已被提及过，通过安装`esbuild`解决。

```bash
yarn add -D esbuild@0.13.4
```
