# TS 类型声明

```ts
interface RoleItem {
  id: number;
  roleCode: string;
  roleName: string;
  appCode: string;
  sysCode: string;
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
- 模拟数据的内存存储模块请参考：`apps/backend-mock/utils/system/menu-store.ts`

## 字典接口

- 路由文件路径：`apps/backend-mock/routes/system/dict`
- 内存存储路径：`apps/backend-mock/utils/system/dict-store.ts`

## 用户接口

- 路由文件路径：`apps/backend-mock/routes/system/users`
- 内存存储路径：`apps/backend-mock/utils/system/users-store.ts`

- 用户列表接口 get `/users`，返回用户列表，参数有：
  - params
    - userCode（string）
    - userName（string）
    - employmentStatus（'ON_JOB' | 'OFF_JOB' | 'UNKNOWN'）
    - pageSize（number）
    - pageNo（number）
  - 返回值有：
    - status（number）, 0表示成功，非0表示失败
    - msg（string）, 错误信息
    - currentPage（number）, 当前页码
    - pageSize（number）, 每页条数
    - totalPage（number）
    - total（number）
    - data（UserItem[]）

- 用户更新接口 put `/users/:id`，返回用户详情，参数有：
  - id（number）
  - body
    - status（'DISABLE' | 'ENABLE' | 'UNKNOWN'）
    - position（string）
  - 返回值有：
    - status（number）, 0表示成功，非0表示失败
    - msg（string）, 错误信息

# 前端（ apps/web-ele ）

## 重要背景

- 请严格遵循 Vben Admin 目录规范
- 技术栈：Vue3 + Element Plus + TypeScript + Pinia
- 已使用 unplugin-element-plus/vite 插件按需导入 element-plus 组件, 禁止使用时再次导入
- 组件通信优先使用 Props/Emits，跨组件状态使用 Pinia（避免全局变量）

## 用户管理页面

### 入口页面（index.vue）

- 整合 UserEditor 组件
- 处理组件间通信（编辑触发）
- 使用内置的 `vex-table` 组件渲染：用户搜索表单、用户表格
  - 搜索字段有：
    - userCode（Input）
    - userName（Input）
    - employmentStatus（Select）
  - 用户表格列有：
    - 复选框(checkbox)
    - id
    - userCode
    - userName
    - gender(ElTag)
    - companyPosition(Slot)
    - employmentStatus(ElTag)
    - roles
    - userStatus(ElTag)
    - email
    - deptName 部门名称
    - parentDeptName 上级部门名称
    - createTime
    - updateTime
    - 操作（编辑、启用/禁用）, "启用/禁用" 需要二次确认
  - 针对 companyPosition, 先查询字典接口 `/dict?dictCode=COMPANY_POSITION`, 然后根据返回的字典项，渲染 companyPosition 字段

### UserEditor.vue（编辑弹窗）

- 容器：ElDialog
- 表单：ElForm, 表单属性有：
  - userCode（ElInput, Disabled）
  - userName（ElInput, Disabled）
  - gender（ElRadio, Disabled）
  - employmentStatus(ElRadio, Disabled)
  - email（ElInput, Disabled）
  - userStatus（ElSelect, required）
  - companyPosition（ElSelect,required）, ElSelect选项从 `/dict?dictCode=COMPANY_POSITION` 获取
- 交互：
  - 通过 Props 传递用户数据
  - 表单校验：使用 ElForm 内置校验规则（必填、格式等）
  - 确定（表单提交）/取消：使用 Elbutton，提交后调用接口并关闭弹窗，通知父组件刷新表格
