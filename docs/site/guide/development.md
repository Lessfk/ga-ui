# 本地开发

## 安装依赖

仓库使用 pnpm workspace：

```bash
pnpm install
```

## 启动文档站

```bash
pnpm docs:dev
```

文档站默认使用 `5557` 端口。页面案例通过 `ga-ui-plus` 的公开导入路径引用组件，Vite 在开发期间将这些入口映射到 `packages/ui/src`。

## 启动 Playground

```bash
pnpm --filter playground dev
```

开发新组件或快速复现问题时先使用 Playground；确认 API 后，再把精简且稳定的案例放入 `docs/site/demos`。

## 常用验证

```bash
pnpm docs:test
pnpm docs:build
pnpm --filter ga-ui-plus test
pnpm --filter ga-ui-plus build
```

`docs:test` 检查所有公开组件是否都有实时案例和完整 API 分区；`docs:build` 检查 Markdown、Vue SFC、导航和资源能否完成生产构建。

## 新增文档页面

1. 在 `docs/site/demos/<component>` 创建独立案例组件。
2. 在 `docs/site/components` 创建组件页面并导入案例。
3. 使用 `<<<` 引用案例源文件，避免复制一份代码。
4. 在 `docs/.vitepress/config.mts` 增加侧边栏入口。
5. 更新 `docs/tests/docs-content.spec.mjs` 中的公开页面列表。
