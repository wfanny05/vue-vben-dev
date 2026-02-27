<script setup lang="ts">
import { computed } from 'vue';

// 定义组件 Props（TypeScript 类型约束）
interface Props {
  // 按钮大小：继承 Element Plus 按钮的 size 类型
  size?: 'default' | 'large' | 'small';
  // 自定义 5 种按钮类型，对应不同背景色
  type?: 'assist' | 'danger' | 'primary' | 'success' | 'warning';
}

// 声明 Props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  type: 'primary',
});

// 声明组件可触发的事件（透传 Element Plus 按钮的 click 事件）
defineEmits(['click']);

// 计算属性：根据 type 生成对应的背景色
const buttonColor = computed(() => {
  // 定义 5 种类型
  const typeStyles = {
    primary: '#006be6',
    success: '#0bd092',
    warning: '#efbd48',
    danger: '#bb1b1b',
    assist: '#626aef',
  };

  return `${typeStyles[props.type]}`;
});
</script>

<template>
  <!-- 基于 Element Plus 按钮封装，结合 Tailwind 自定义样式 -->
  <!-- $attrs 透传未声明的 props（如 disabled、icon 等） -->
  <el-button
    :size="size"
    :color="buttonColor"
    @click="$emit('click', $event)"
    v-bind="$attrs"
  >
    <slot></slot>
    <!-- 按钮文本/内容插槽 -->
  </el-button>
</template>

<style scoped>
/* 可选：覆盖 Element Plus 按钮的默认样式，确保 Tailwind 生效 */

/* .el-button:deep(),
.el-button--small:deep() {
  outline: none;
  border: none;
  box-shadow: none;
} */

/* 移除 Element Plus 按钮的 hover 渐变，使用 Tailwind 的 hover 样式 */

/* .el-button:hover:deep() {
  background-color: inherit;
} */
</style>
