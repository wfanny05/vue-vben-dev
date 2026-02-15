# 需求：基于 Vben Admin (app/web-ele) 开发菜单管理页面
## 核心背景
在 Vben Admin 项目的 `app/web-ele` 应用下开发菜单管理页面，严格遵循 Vben Admin 目录规范，同时指定组件库使用规则，按功能拆分独立组件，后端通过 Nitro 模拟接口。

## 技术栈与组件规范
### 前端（app/web-ele）
- 基础框架：Vue3 + TypeScript + Pinia
- 核心组件例外：仅保留 Vben 内置的 `vex-table`（树形表格）、`IconPicker`（图标选择器）
- 通用组件库：Element Plus（替代 Vben 内置表单/弹窗/按钮等，如 el-form、el-dialog、el-button）
- 网络请求：项目内置的 `useAxios`/`request` 工具（遵循请求/响应拦截规范）
- 样式：Tailwind CSS + Element Plus 样式变量（兼容 Vben 全局样式）
- 组件拆分：按功能拆分为独立组件（MenuTable、MenuEditor、SearchForm）

### 后端模拟（apps/backend-mock）
- 模拟服务：Nitro（遵循项目已有 Nitro 接口规范）
- 数据存储：内存临时存储（无需持久化）
- 接口前缀：`/api/system/menu`

## 目录结构要求
src/views/system/menu/
├── index.vue # 页面入口（整合所有子组件）
├── components/│ 
├── MenuTable.vue # 菜单表格组件（基于 vex-table）│ 
├── MenuEditor.vue # 菜单新增 / 编辑弹窗（基于 el-form + IconPicker）│
└── SearchForm.vue # 搜索表单组件（基于 el-form）

## 功能与组件详细要求
### 1. 入口页面（index.vue）
- 职责：整合 SearchForm、MenuTable、MenuEditor 组件
- 处理组件间通信（如搜索条件传递、新增/编辑触发、表格刷新）
- 全局状态管理：通过 Pinia 或 Props/Emits 管理菜单数据

### 2. SearchForm.vue（搜索表单）
- 基于 Element Plus 的 `el-form` 实现
- 搜索字段：菜单名称（模糊搜索）、路由地址（模糊搜索）、状态（下拉选择：全部/启用/禁用）
- 功能按钮：搜索、重置（使用 el-button）
- 交互：表单提交后向父组件传递搜索参数，触发表格刷新

### 3. MenuTable.vue（菜单表格）
- 核心：使用 Vben 内置 `vex-table` 实现树形表格（支持3级层级）
- 表格字段配置：
  - id：隐藏列
  - name：菜单名称（树形展示）
  - routePath：路由地址
  - menuIcon：图标展示（渲染 IconPicker 选择的图标）
  - menuSort：排序值（可直接编辑）
  - menuStatus：状态（el-switch 组件，切换后调用接口更新）
  - operation：操作列（el-button 实现编辑/删除按钮）
- 交互功能：
  - 支持树形展开/折叠、列排序
  - 删除按钮：点击后触发 el-dialog 二次确认，有子菜单时禁用并提示
  - 空状态：使用 Element Plus 空状态组件，显示“暂无菜单数据”+新增按钮

### 4. MenuEditor.vue（菜单编辑弹窗）
- 容器：Element Plus 的 `el-dialog`
- 表单：使用 `el-form`，包含以下字段：
  - 父菜单：el-select（下拉选择已有菜单，支持“一级菜单”选项）
  - 菜单名称：el-input（必填校验）
  - 路由地址：el-input（必填+唯一性校验）
  - 图标：Vben 内置 `IconPicker` 组件（支持图标预览、搜索）
  - 排序值：el-input-number（正整数）
  - 状态：el-radio-group（启用/禁用）
- 交互：
  - 新增/编辑复用同一组件，通过 Props 传递是否为编辑状态及初始数据
  - 表单校验：使用 el-form 内置校验规则（必填、格式等）
  - 确定（表单提交）/取消：使用 el-button，提交后调用接口并关闭弹窗，通知父组件刷新表格

## 接口模拟要求（apps/backend-mock）
### 路由文件路径
`apps/backend-mock/routes/system/menu.ts`

### 核心接口列表
| 方法 | 路径                  | 功能                 |
|------|-----------------------|----------------------|
| GET  | /api/system/menu      | 获取菜单列表（支持搜索参数） |
| POST | /api/system/menu      | 新增菜单             |
| PUT  | /api/system/menu/:id  | 编辑菜单             |
| DELETE | /api/system/menu/:id | 删除菜单             |
| PATCH | /api/system/menu/:id/status | 切换状态      |

### 接口逻辑
- 内存维护树形菜单数据（包含 parentId、id、name、routePath、menuIcon、menuSort、menustatus 字段）
- 处理边界逻辑：删除有子菜单的菜单返回 400 错误、新增重复路由返回 400 错误
- 响应格式：兼容 Vben Admin 前端请求拦截器（包含 code、msg、data 字段）

## 代码规范要求
1. 严格遵循 Vben Admin 代码风格（变量命名、注释、函数组织）
2. TypeScript 类型定义完整（MenuInfo、MenuFormData、SearchParams 等）
3. 组件通信优先使用 Props/Emits，跨组件状态使用 Pinia（避免全局变量）
4. 接口请求封装在 src/api 中，统一处理请求参数和响应数据
5. Element Plus 组件按需引入（遵循 Vben Admin 组件引入规范）
6. 关键逻辑添加注释（如 vex-table 树形配置、IconPicker 取值逻辑）

## 输出要求
1. 完整的目录结构代码：包含 index.vue、components 下所有子组件
2. 类型定义代码：`src/types/system/menu.ts`
3. 接口请求代码：`src/api/system/menu.ts`
4. Nitro 模拟接口代码：apps/backend-mock/routes/system/menu.ts
5. 接入说明：组件注册方式、接口联调步骤、Element Plus 按需引入配置
6. 关键逻辑说明：vex-table 树形配置、IconPicker 与 el-form 结合使用、组件通信逻辑
