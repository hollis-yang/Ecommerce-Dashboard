<!-- 商家销量统计横向柱状图 -->
<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts';

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const seller_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据
const chartInstance = ref(null)  // echarts实例
const timeId = ref(null)  // 定时器ID(用于销毁定时器)

let currentPage = 1  // 当前显示的页数(用定时器改变)
let totalPage = 0  // 一共有多少页

// 初始化 echartsInstance 对象
function initChart() {
  chartInstance.value = echarts.init(seller_ref.value)
  // 监听鼠标位置(如果鼠标在图表内就关闭定时器)
  chartInstance.value.on('mouseover', () => {
    clearInterval(timeId.value)
  })
  chartInstance.value.on('mouseout', () => {
    startInterval()
  })
}

async function getData() {
  // http://127.0.0.1:8888/api/seller
  const { data: ret } = await $http.get('seller')  // 解构ret
  allData.value = ret
  // 对allData排序
  allData.value = allData.value.sort((a, b) => {
    return a.value - b.value  // 从小到大
  })
  // 计算totalPage(5条数据一页)
  totalPage = allData.value.length % 5 === 0 ? allData.value.length / 5 : allData.value.length / 5 + 1
  updateChart()
  startInterval()  // 启动定时器
}

// 动态刷新函数
const startInterval = function () {
  if (timeId.value) {
    clearInterval(timeId)
  }
  // timeID用于取消定时器
  timeId.value = setInterval(() => {
    currentPage++
    // 超过了totalPage就归零
    if (currentPage > totalPage) {
      currentPage = 1
    }
    updateChart()  // 根据新的currentPage渲染图表
  }, 1000)  // 3秒刷新一次
}

function updateChart() {
  // 根据currentPage筛选allData
  const start = (currentPage - 1) * 5
  const end = currentPage * 5
  const showData = allData.value.slice(start, end)  // slice包含start，不包含end  eg. [0:5)
  // 获取其中的name和value
  const sellerNames = showData.map((item) => item.name)
  const sellerValues = showData.map((item) => item.value)
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
onUnmounted(() => {
  clearInterval(timeId.value)
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