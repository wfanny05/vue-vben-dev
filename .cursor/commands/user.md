# 类型声明

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

- 通过 Nitro 模拟接口

## 用户接口

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

重要别急

- 技术栈：Vue3 + Element Plus + TypeScript + Pinia

## 用户管理页面

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

- 使用 ElDialog、ElForm 等组件开发用户编辑组件 UserEditor，其中表单属性有：
  - userCode（ElInput, Disabled）
  - userName（ElInput, Disabled）
  - gender（ElRadio, Disabled）
  - employmentStatus(ElRadio, Disabled)
  - email（ElInput, Disabled）
  - userStatus（ElSelect, required）
  - companyPosition（ElSelect,required）, ElSelect选项从 `/dict?dictCode=COMPANY_POSITION` 获取
