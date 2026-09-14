# 按需引入

使用 `unplugin-vue-components` 时，`GaUiResolver` 可以自动解析 `GaXxx` 组件，并补齐组件内部依赖的 Element Plus 样式。

## 安装插件

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

## 默认配置

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { GaUiResolver } from 'ga-ui-plus/resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), GaUiResolver()],
    }),
  ],
})
```

`ElementPlusResolver` 处理模板中直接使用的 `ElXxx` 组件，`GaUiResolver` 处理 `GaXxx` 组件及其内部样式依赖。

## 业务项目已全量引入 Element Plus 样式

```ts
import 'element-plus/dist/index.css'

Components({
  resolvers: [
    ElementPlusResolver({ importStyle: false }),
    GaUiResolver({ elementPlusStyle: false }),
  ],
})
```

## Resolver 配置

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `importStyle` | `boolean` | `true` | 自动引入 `ga-ui-plus/style.css` |
| `elementPlusStyle` | `boolean` | `true` | 自动引入 GA 组件内部需要的 Element Plus 按需样式 |

通过 JavaScript 显式导入组件不会触发 Resolver。这种情况下需要在应用入口手动引入对应样式。
