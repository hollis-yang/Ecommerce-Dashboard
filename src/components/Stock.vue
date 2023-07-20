<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const stock_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据
const currentIndex = ref(0)  // 当前显示数据的页数
const timeId = ref(null)  // 定时器标识

// echarts 实例在 Vue3 中不能是响应式对象
let chartInstance  // echarts实例


// 初始化 echartsInstance 对象
function initChart() {
  chartInstance = echarts.init(stock_ref.value, 'chalk')

  // 图表初始化配置
  const initOption = {
    title: {
      text: '丨库存和销量分析',
      left: 20,
      top: 20
    }
  }
  chartInstance.setOption(initOption)

  // 鼠标移入图表取消定时器
  chartInstance.on('mouseover', () => {
    clearInterval(timeId.value)
  })
  // 鼠标移出重启定时器
  chartInstance.on('mouseout', startInterval)
}

async function getData() {
  // http://127.0.0.1:8888/api/stock
  const { data: ret } = await $http.get('stock')  // 解构ret
  allData.value = ret
  console.log(ret)

  updateChart()

  startInterval()  // 启动定时器
}


function updateChart() {
  // 数据处理
  const start = currentIndex.value * 5
  const showData = allData.value.slice(start, start + 5)  // 每次展示5个圆环图
  const centerArr = [
    ['18%', '40%'],
    ['50%', '40%'],
    ['82%', '40%'],
    ['34%', '75%'],
    ['66%', '75%']
  ]
  const colorArr = [
    ['#4FF778', '#0BA82C'],
    ['#E5DD45', '#E8B11C'],
    ['#E8821C', '#E55445'],
    ['#5052EE', '#AB6EE5'],
    ['#23E5E5', '#2E72BF']
  ]

  // 在updateChart里自适应label文字大小避免代码冗余
  const titleFontSize = stock_ref.value.offsetWidth / 100 * 3.6
  const innerRadius = titleFontSize * 2
  const outerRadius = innerRadius * 1.125

  const seriesArr = showData.map((item, index) => {
    return {
      type: 'pie',
      radius: [outerRadius, innerRadius],
      hoverAnimation: false, // 关闭鼠标移入饼图的动画
      labelLine: {
        show: false,  // 隐藏指示线
      },
      // 每个圆环图中心点
      center: centerArr[index],
      data: [
        {
          // 销量
          name: item.name + '\n' + item.sales,
          value: item.sales,
          label: {
            position: 'center',
            color: colorArr[index][0],
            fontSize: titleFontSize / 2
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: colorArr[index][0]
              },
              {
                offset: 1,
                color: colorArr[index][1]
              }
            ])
          }
        },
        {
          // 库存
          value: item.stock,
          itemStyle: {
            color: '#333843'
          }
        }
      ]
    }
  })

  // 图表数据配置
  const dataOption = {
    series: seriesArr
  }
  chartInstance.setOption(dataOption)
}

// 当window大小变化时调用，完成屏幕适配
function screenAdapter() {
  const titleFontSize = stock_ref.value.offsetWidth / 100 * 3.6

  // 图表分辨率相关参数配置
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    }
  }
  chartInstance.setOption(adapterOption)

  // 屏幕大小改变后，需要调用图表实例对象 `chartInstance` 的 `resize` => 才能产生新图表
  chartInstance.resize()
}

// 定时切换
function startInterval() {
  if (timeId.value) {
    clearInterval(timeId.value)
  }
  timeId.value = setInterval(() => {
    currentIndex.value++
    if (currentIndex.value > 1) {
      currentIndex.value = 0
    }
    updateChart()
  }, 5000);
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
    <div class="com-chart" ref="stock_ref">
    </div>
  </div>
</template>

<style scoped lang="less"></style>