# 菜单管理页面 - 接入与逻辑说明

## 接入说明

### 组件与路由

- **路由**：已在 `src/router/routes/modules/system.ts` 中注册，路径为 `/system/menu`，父级为「系统管理」。
- **入口**：`src/views/system/menu/index.vue` 整合 SearchForm、MenuTable、MenuEditor，无需在别处再注册子组件。
- **Element Plus**：页面内按需从 `element-plus` 引入所用组件（如 ElForm、ElDialog、ElButton 等），与项目现有 `adapter/component` 的按需引入方式一致；若项目已配置 `unplugin-vue-components` 解析 Element Plus，则也可自动按需注册。

### 接口联调

1. **后端 Mock**：Nitro 接口在 `apps/backend-mock` 下：
   - `GET /api/system/menu`：列表（支持 query：name、routePath、menuStatus）
   - `POST /api/system/menu`：新增
   - `PUT /api/system/menu/:id`：编辑
   - `DELETE /api/system/menu/:id`：删除
   - `PATCH /api/system/menu/:id/status`：切换状态（body: `{ menuStatus: 0 | 1 }`）
2. **前端请求**：统一在 `src/api/system/menu.ts` 中封装，使用项目 `requestClient`，baseURL 指向 Mock 或真实后端即可。
3. **联调步骤**：先启动 `apps/backend-mock`，再启动 `apps/web-ele`，访问「系统管理 -> 菜单管理」即可。Mock 已允许菜单相关写操作（middleware 中放行 `/api/system/menu`）。

---

## 关键逻辑说明

### 1. VxeTable 树形配置

- 在 `MenuTable.vue` 中通过 `useVbenVxeGrid` 的 `gridOptions` 配置树形表格：
  - **treeConfig**：`parentField: 'parentId'`、`rowField: 'id'`、`transform: false`，与后端返回的树形结构（含 `parentId`、`children`）一致，支持多级展开/折叠。
  - **列**：菜单名称列设置 `treeNode: true`，其余列为普通列；排序、状态、操作等通过插槽渲染（如 `#status`、`#operation`）。

### 2. IconPicker 与表单一同使用

- 在 `MenuEditor.vue` 中直接使用 `@vben/common-ui` 的 `IconPicker`，与 `el-form` 同处一表单：
  - 使用 `v-model="form.menuIcon"` 绑定，表单项用 `ElFormItem` 包一层，`prop="menuIcon"` 即可参与校验与提交。
  - IconPicker 支持图标预览与搜索，选中的图标字符串（如 `lucide:menu`）写入 `form.menuIcon`，提交时随表单一起发给后端。

### 3. 组件通信逻辑

- **index.vue**：持有 `searchParams`、`tableRef`、`editorVisible`、`editorInitialData`。
  - SearchForm 触发 `@search` / `@reset` 时更新 `searchParams` 并调用 `tableRef.query()` 刷新表格。
  - MenuTable 通过 `searchParams` 作为 prop 传入，在 `proxyConfig.ajax.query` 中调用 `getMenuListApi(props.searchParams)` 拉取列表；编辑/删除后通过 `defineExpose` 暴露的 `query()` 由父组件调用刷新。
  - MenuEditor 通过 `visible`、`initialData` 控制显隐与初始值；`@success` 时父组件关闭弹窗并调用 `tableRef.query()`，保证列表与编辑结果一致。
