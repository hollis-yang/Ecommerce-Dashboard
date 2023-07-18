<!-- 针对 /sellerpage 这一路径才显示
在该组件中，通过子组件注册的方式，要显示 Seller.vue 这一组件的内容 -->
<script setup>
import Seller from '@/components/Seller.vue'
</script>

<template>
  <div class="com-page">
    <Seller></Seller>
  </div>
</template>

<style scoped lang="less"></style>