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

  // 图表初始化配置
  const initOption = {
    // 横向柱状图，所以数值轴为x；类目轴为y
    title: {
      text: '丨商家销售量统计',
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
      type: 'category'
    },
    tooltip: {
      trigger: 'axis',
      // 坐标轴指示器配置项
      axisPointer: {
        type: 'line',
        z: 0,  // 显示层级低于柱体本身
        lineStyle: {
          color: '#2d3443',
          type: 'solid'  // 默认为dashed
        }
      }
    },
    series: [
      {
        type: 'bar',
        label: {
          show: true,
          position: 'right',
          textStyle: {
            color: 'white'
          }
        },
        itemStyle: {
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
  chartInstance.value.setOption(initOption)

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

  // 图表数据配置
  const dataOption = {
    yAxis: {
      data: sellerNames
    },
    series: [{
      data: sellerValues,
    }]
  }
  chartInstance.value.setOption(dataOption)
}

// 当window大小变化时调用，完成屏幕适配
function screenAdapter() {
  // 容器的宽度 `seller_ref.value.offsetWidth`
  const titleFontSize = seller_ref.value.offsetWidth / 100 * 3.6
  
  // 图表分辨率相关参数配置
  const adapterOption = {
    // 横向柱状图，所以数值轴为x；类目轴为y
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    tooltip: {
      // 坐标轴指示器配置项
      axisPointer: {
        lineStyle: {
          width: titleFontSize
        }
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          // 柱体的圆角
          borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
        }
      }
    ]
  }
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
  clearInterval(timeId.value)
  // 组件销毁时取消事件监听
  window.removeEventListener('resize', screenAdapter)
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