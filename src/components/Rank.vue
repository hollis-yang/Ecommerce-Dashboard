<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const rank_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据
// 区域缩放起终点
const startValue = ref(0)
const endValue = ref(9)

const timeId = ref(null)  // 定时器ID(用于销毁定时器)

// echarts 实例在 Vue3 中不能是响应式对象
let chartInstance  // echarts实例


// 初始化 echartsInstance 对象
function initChart() {
  chartInstance = echarts.init(rank_ref.value, 'chalk')

  // 图表初始化配置
  const initOption = {
    title: {
      text: '丨地区销售排行',
      left: 20,
      top: 20
    },
    grid: {
      top: '40%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      show: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar'
      }
    ]
  }
  chartInstance.setOption(initOption)

  // 监听鼠标位置(如果鼠标在图表内就关闭定时器)
  chartInstance.on('mouseover', () => {
    clearInterval(timeId.value)
  })
  chartInstance.on('mouseout', () => {
    startInterval()
  })
}

async function getData() {
  // http://127.0.0.1:8888/api/rank
  const { data: ret } = await $http.get('rank')  // 解构ret
  allData.value = ret
  // 从大到小排序
  allData.value.sort((a, b) => {
    return - a.value + b.value
  })

  updateChart()

  // 启动定时器平移柱状图
  startInterval()
}


function updateChart() {
  // 颜色数组
  const colorArr = [
    ['#0ba82c', '#4ff778'],
    ['#2e72bf', '#23e5e5'],
    ['#5052ee', '#ab6ee5']
  ]

  // 数据处理
  const provinceArr = allData.value.map(item => {
    return item.name
  })  // 省份名称数组(x)
  const valueArr = allData.value.map(item => {
    return item.value
  })  // 省份销售金额数组(y)

  // 图表数据配置
  const dataOption = {
    xAxis: {
      data: provinceArr
    },
    dataZoom: {
      // 区域缩放组件
      show: false,    // 不需要拖拽轴
      // 开始时只展示10条
      startValue: startValue.value,
      endValue: endValue.value
    },
    series: [
      {
        data: valueArr,
        itemStyle: {
          color: (arg) => {
            let targetArr = null
            // console.log(arg.data)  // 代表给一个柱的数值
            if (arg.data > 300) {
              targetArr = colorArr[0]
            } else if (arg.data > 200) {
              targetArr = colorArr[1]
            } else {
              targetArr = colorArr[2]
            }
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: targetArr[0]
              },
              {
                offset: 1,
                color: targetArr[1]
              }
            ])
          }
        }
      }
    ]
  }
  chartInstance.setOption(dataOption)
}

// 当window大小变化时调用，完成屏幕适配
function screenAdapter() {
  const titleFontSize = rank_ref.value.offsetWidth / 100 * 3.6

  // 图表分辨率相关参数配置
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          borderRadius: [titleFontSize / 3, titleFontSize / 3, 0, 0]
        }
      }
    ]
  }
  chartInstance.setOption(adapterOption)

  // 屏幕大小改变后，需要调用图表实例对象 `chartInstance` 的 `resize` => 才能产生新图表
  chartInstance.resize()
}

defineExpose({
  screenAdapter
})

function startInterval() {
  if (timeId.value) {
    clearInterval(timeId.value)
  }

  timeId.value = setInterval(() => {
    startValue.value++
    endValue.value++

    if (endValue.value > allData.value.length - 1) {
      startValue.value = 0
      endValue.value = 9
    }

    updateChart()
  }, 2000)
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
    <div class="com-chart" ref="rank_ref">
    </div>
  </div>
</template>

<style scoped lang="less"></style>