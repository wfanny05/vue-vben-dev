<script setup lang="ts">
import { computed } from 'vue'

// 定义组件 Props（TypeScript 类型约束）
interface Props {
  // 按钮大小：继承 Element Plus 按钮的 size 类型
  size?: 'default' | 'large' | 'small'
  // 自定义 5 种按钮类型，对应不同背景色
  type?: 'danger' | 'info' | 'primary' | 'success' | 'warning'
}

// 声明 Props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  type: 'primary'
})

// 声明组件可触发的事件（透传 Element Plus 按钮的 click 事件）
defineEmits(['click'])

// 计算属性：根据 type 生成对应的 Tailwind 背景色类名
const buttonClass = computed(() => {
  // 定义 5 种类型对应的 Tailwind 样式（可根据需求自定义）
  const typeStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-slate-500 hover:bg-slate-600 text-white'
  }

  // 基础样式：统一圆角、边框等，覆盖 Element Plus 默认样式
  const baseStyle = 'rounded-md border-0'

  return `${baseStyle} ${typeStyles[props.type]}`
})

</script>

<!-- style="background-color: hsl(var(--table-cell-button-bg-1))" -->


<template>
  <!-- 基于 Element Plus 按钮封装，结合 Tailwind 自定义样式 -->
  <el-button
    :size="size"
    :class="buttonClass"
    @click="$emit('click', $event)"
    v-bind="$attrs" <!-- 透传未声明的 props（如 disabled、icon 等） --
>
  >
    <slot></slot> <!-- 按钮文本/内容插槽 -->
  </el-button>
</template>

<style scoped>
/* 可选：覆盖 Element Plus 按钮的默认样式，确保 Tailwind 生效 */
:deep(.el-button) {
  outline: none;
  border: none;
  box-shadow: none;
}

/* 移除 Element Plus 按钮的 hover 渐变，使用 Tailwind 的 hover 样式 */
:deep(.el-button:hover) {
  background-color: inherit;
}
</style>
