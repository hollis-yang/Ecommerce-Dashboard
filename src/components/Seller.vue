<!-- 商家销量统计横向柱状图 -->
<script setup>
import { onMounted, ref } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts';

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const seller_ref = ref(null)
const allData = ref(null)
const chartInstance = ref(null)

// 初始化 echartsInstance 对象
function initChart() {
  chartInstance.value = echarts.init(seller_ref.value)
}

async function getData() {
  // http://127.0.0.1:8888/api/seller
  const {data: ret} = await $http.get('seller')  // 解构ret
  allData.value = ret
  // console.log(allData.value)
  updateChart()
}

function updateChart() {
  const sellerNames = allData.value.map((item) => item.name)
  const sellerValues = allData.value.map((item) => item.value)
  const option = {
    // 横向柱状图，所以数值轴为x；类目轴为y
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: sellerNames
    },
    series: [
      {
        type: 'bar',
        data: sellerValues
      }
    ]
  }
  chartInstance.value.setOption(option)
}

onMounted(() => {
  initChart()
  getData()
})
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref">
      seller
    </div>
  </div>
</template>

<style scoped lang="less"></style>