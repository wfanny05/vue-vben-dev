# TS 类型声明

```ts
interface RoleItem {
  id: number;
  roleCode: string;
  roleName: string;
  appCode: string;
  sysCode: string;
  roleStatus: 'DISABLE' | 'ENABLE' | 'UNKNOWN';
}

interface UserItem {
  id: number;
  userUid: string;
  userCode: string;
  userName: string;
  email: string;
  employmentStatus: 'ON_JOB' | 'OFF_JOB' | 'UNKNOWN';
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  deptName: string;
  deptCode: string;
  parentDeptName: string;
  createTime: string;
  updateTime: string;
  userStatus: 'DISABLE' | 'ENABLE' | 'UNKNOWN';
  companyPosition: string;
  roles: string[];
}
```

# 后端模拟（apps/backend-mock）

## 重要背景

- 请严格遵循 Vben Admin 目录规范
- 通过 Nitro 模拟接口
- 模拟数据的内存存储模块请参考：`apps/backend-mock/utils/web-ele/menu-store.ts`

## 字典接口

- 路由文件路径：`apps/backend-mock/routes/web-ele/dict`
- 内存存储路径：`apps/backend-mock/utils/web-ele/dict-store.ts`

## 角色接口

- 路由文件路径：`apps/backend-mock/routes/web-ele/role`
- 内存存储路径：`apps/backend-mock/utils/web-ele/role-store.ts`

## 用户接口

- 路由文件路径：`apps/backend-mock/routes/web-ele/users`
- 内存存储路径：`apps/backend-mock/utils/web-ele/users-store.ts`

- 获取全部可绑定的角色列表: get `/users/binding-role/list`，参数有：
  - params
    - roleName（string）
    - appCode（string）
    - sysCode（string）
  - 返回值有：
    - status（number）, 0表示成功，非0表示失败
    - msg（string）, 错误信息
    - data（RoleItem[]）

- 获取已绑定的角色列表: get `/users/:userCode/roles`，参数有：
  - userCode（string）
  - 返回值有：
    - status（number）, 0表示成功，非0表示失败
    - msg（string）, 错误信息
    - data（RoleItem[]）

- 为用户绑定角色: post `/users/:userCode/roles`，参数有：
  - userCode（string）
  - body
    - addRoleIds（string[]）
    - delRoleIds（string[]）
  - 返回值有：
    - status（number）, 0表示成功，非0表示失败
    - msg（string）, 错误信息

# 前端（ apps/web-ele ）

## 重要背景

- 请严格遵循 Vben Admin 目录规范
- 技术栈：Vue3 + Element Plus + TypeScript + Pinia
- 已使用 unplugin-element-plus/vite 插件按需导入 element-plus 组件, 禁止使用时再次导入
- 组件通信优先使用 Props/Emits，跨组件状态使用 Pinia（避免全局变量）

## 用户管理页面（/apps/web-ele/src/views/system/user）

### 入口页面（index.vue）新增需求

- 新增表格操作按钮（角色管理），点击后弹出角色管理弹窗

### RoleManager.vue（角色管理弹窗）

- 容器：ElDialog
- 穿梭框：ElTransfer,
  - 需要展示已绑定角色和未绑定角色，
  - 支持搜索，可搜索字段：roleName, appCode, sysCode
  - 列表项展示有：标签（appCode，使用Eltag显示）、标签（sysCode，使用Eltag显示）、描述（roleName）
- 交互：
  - 通过 Props 传递用户数据
  - 表单校验：使用 ElForm 内置校验规则（必填、格式等）
  - 确定（调用接口：post `/users/:userCode/roles`）/取消：使用 Elbutton，调用接口后关闭弹窗，通知父组件刷新表格

## 输出

- 用户管理页面（/apps/web-ele/src/views/system/user）
