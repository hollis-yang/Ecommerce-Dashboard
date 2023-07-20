<script setup>
import { onMounted, ref, onUnmounted, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const hot_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据
const currentIndex = ref(0)  // 当前饼图所代表的一级分类数据
const titleFontSize = ref(0)

// echarts 实例在 Vue3 中不能是响应式对象
let chartInstance  // echarts实例


// 初始化 echartsInstance 对象
function initChart() {
  chartInstance = echarts.init(hot_ref.value, 'chalk')

  // 图表初始化配置
  const initOption = {
    title: {
      text: '丨热销商品的占比',
      left: 20,
      top: 20
    },
    legend: {
      top: '15%',
      icon: 'circle'
    },
    tooltip: {
      show: true,
      formatter: (arg) => {
        console.log(arg)
        // 获取该二级分类下的所有三级分类
        const thirdCategory = arg.data.children
        // 计算总和
        let total = 0
        thirdCategory.forEach(item => {
          total += item.value
        })
        // 计算每个三级分类的占比
        let retStr = `<div style="width: 10px; height: 10px; background-color: ${arg.color}; border-radius: 50%; display: inline-block;"></div>`
        retStr += `<div style="display: inline-block; color: ${arg.color}">&nbsp;&nbsp;${arg.data.name}</div><br>`
        
        thirdCategory.forEach(item => {
          retStr += `
            ${item.name}: ${parseInt(item.value / total * 100)}%<br>
          `
        })
        return retStr
      }
    },
    series: [
      {
        type: 'pie',
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true
          },
          labelLine: {
            show: false
          }
        }
      }
    ]
  }
  chartInstance.setOption(initOption)
}

async function getData() {
  // http://127.0.0.1:8888/api/hotproduct
  const { data: ret } = await $http.get('hotproduct')  // 解构ret
  allData.value = ret

  updateChart()
}


function updateChart() {
  // 数据处理
  const seriesData = allData.value[currentIndex.value].children.map(item => {
    return {
      name: item.name,
      value: item.value,
      // 传入三级分类给tooltip使用
      children: item.children
    }
  })
  const legendData = allData.value[currentIndex.value].children.map(item => {
    return item.name
  })

  // 图表数据配置
  const dataOption = {
    legend: {
      data: legendData
    },
    series: [
      {
        data: seriesData
      }
    ]
  }
  chartInstance.setOption(dataOption)
}

// 当window大小变化时调用，完成屏幕适配
function screenAdapter() {
  titleFontSize.value = hot_ref.value.offsetWidth / 100 * 3.6

  // 图表分辨率相关参数配置
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    legend: {
      itemWidth: titleFontSize.value / 2,
      itemHeight: titleFontSize.value / 2,
      itemGap: titleFontSize.value / 2,
      textStyle: {
        fontSize: titleFontSize.value / 2
      }
    },
    series: [
      {
        radius: titleFontSize.value * 6,
        center: ['50%', '60%']
      }
    ]
  }
  chartInstance.setOption(adapterOption)

  // 屏幕大小改变后，需要调用图表实例对象 `chartInstance` 的 `resize` => 才能产生新图表
  chartInstance.resize()
}

// 饼图左右切换
function toLeft() {
  currentIndex.value--
  if (currentIndex.value < 0) {
    currentIndex.value = allData.value.length - 1
  }
  updateChart()
}
function toRight() {
  currentIndex.value++
  if (currentIndex.value > allData.value.length - 1) {
    currentIndex.value = 0
  }
  updateChart()
}

// 获得图标右下角分类名称
const catName = computed(() => {
  if (!allData.value) {
    return ''
  } else {
    return allData.value[currentIndex.value].name
  }
})

// 计算 span 的样式
const comStyle = computed (() => {
  return {
    fontSize: titleFontSize.value + 'px'
  }
})

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
    <div class="com-chart" ref="hot_ref">
    </div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<style scoped lang="less">
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>