<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const page_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据
const chartInstance = ref(null)  // echarts实例

function initChart() {
  chartInstance.value = echarts.init(page_ref.value, 'chalk')

  // 图表初始化配置
  const initOption = {}
  chartInstance.value.setOption(initOption)
}

async function getData() {
  // http://127.0.0.1:8888/api/trend
  const { data: ret } = await $http.get('seller')  // 解构ret
  allData.value = ret

  updateChart()
}

function updateChart() {
  // 图表数据配置
  const dataOption = {}
  chartInstance.value.setOption(dataOption)
}

function screenAdapter() {
  // 图表分辨率相关参数配置
  const adapterOption = {}
  chartInstance.value.setOption(adapterOption)

  // 屏幕大小改变后，需要调用图表实例对象 `chartInstance` 的 `resize` => 才能产生新图表
  chartInstance.value.resize()
}

onMounted(() => {
  initChart()
  getData()
  // 监听window大小变化以进行分辨率适配
  window.addEventListener('resize', screenAdapter)
  // 界面加载完成后主动进行分辨率适配
  screenAdapter()
})
onUnmounted(() => {
  // 组件销毁时取消事件监听
  window.removeEventListener('resize', screenAdapter)
})
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref">
      trend
    </div>
  </div>
</template>

<style scoped lang="less"></style>