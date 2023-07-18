<!-- 商家销量统计横向柱状图 -->
<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'

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
  chartInstance.value = echarts.init(seller_ref.value, 'chalk')
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
  }, 3000)  // 3秒刷新一次
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
    title: {
      text: '丨商家销售量统计',
      textStyle: {
        fontSize: 66
      },
      left: 20,
      top: 20
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '6%',
      bottom: '3%',
      containLabel: true // 使距离包含坐标轴上的label文字
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: sellerNames
    },
    tooltip: {
      trigger: 'axis',
      // 坐标轴指示器配置项
      axisPointer: {
        type: 'line',
        z: 0,  // 显示层级低于柱体本身
        lineStyle: {
          width: 66,
          color: '#2d3443',
          type: 'solid'  // 默认为dashed
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: sellerValues,
        barWidth: 66,
        label: {
          show: true,
          position: 'right',
          textStyle: {
            color: 'white'
          }
        },
        itemStyle: {
          // 柱体的圆角
          borderRadius: [0, 33, 33, 0],
          color: {
            type: 'linear',  // 线性渐变
            // 渐变方向 →
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0, color: '#5052ee' // 0% 处的颜色
            }, {
              offset: 1, color: '#ab6ee5' // 100% 处的颜色
            }],
          }
        }
      }
    ]
  }
  chartInstance.value.setOption(option)
}

onMounted(() => {
  initChart()
})
onMounted(() => {
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