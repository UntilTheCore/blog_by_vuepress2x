# pnpm 指南

## workspace

使用 pnpm 的 workspace步骤：

1. 项目根目录创建 `pnpm-workspace.yaml` 文件并添加以下内容指定包工作空间目录：

```yaml
packages:
  - "packages/**"
```

2. 根目录创建 `packages` 文件夹，相关项目在此文件夹内创建；

### 安装包到特定的项目中

```bash
# -r: 表示安装包到子项目，用 -w 则为安装到根 node_module 中
# --filter: 指定安装的包
pnpm add newPackage -r --filter myProject
```
