<script setup>
import VuePdfApp from 'vue3-pdf-app';

// import this to use default icons for buttons
import 'vue3-pdf-app/dist/icons/main.css';

const props = defineProps({
  pdf: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <!-- used `style="height: 100vh;"` because without it in the Firefox 89 and Chrome 91 (June 2021) the `vue-pdf-app` is not rendering on the page, just empty space without any errors (since `vue-pdf-app` does not have height and it is the top tag in the generated markup ) -->
  <!-- or you can just wrap `vue-pdf-app` in <div> tag and set height for it via CSS (like in `Script tag (unpkg)` example below) -->
  <VuePdfApp style="height: 100vh" :pdf="props.pdf" />
</template>

<style>
.test {
  color: red;
}
</style>
