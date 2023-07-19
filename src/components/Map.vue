<!-- 商家销量统计横向柱状图 -->
<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'
import axios from 'axios'

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const map_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据

// echarts 实例在 Vue3 中不能是响应式对象
let chartInstance  // echarts实例


// 初始化 echartsInstance 对象
async function initChart() {
  chartInstance = echarts.init(map_ref.value, 'chalk')

  // axios 获取中国地图矢量数据
  // http://localhost:5173/static/map/china.json
  const ret = await axios.get('http://localhost:5173/static/map/china.json')  // => Promise
  // 将矢量数据注册到地图
  echarts.registerMap('china', ret.data)


  // 图表初始化配置
  const initOption = {
    geo: {
      type: 'map',
      map: 'china'
    }
  }
  chartInstance.setOption(initOption)
}

async function getData() {
  // http://127.0.0.1:8888/api/seller
  const { data: ret } = await $http.get('seller')  // 解构ret
  allData.value = ret
  updateChart()
}

function updateChart() {
  // 图表数据配置
  const dataOption = {}
  chartInstance.setOption(dataOption)
}

// 当window大小变化时调用，完成屏幕适配
function screenAdapter() {
  // 图表分辨率相关参数配置
  const adapterOption = {}
  chartInstance.setOption(adapterOption)

  // 屏幕大小改变后，需要调用图表实例对象 `chartInstance` 的 `resize` => 才能产生新图表
  chartInstance.resize()
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
    <div class="com-chart" ref="map_ref">
    </div>
  </div>
</template>

<style scoped lang="less"></style>