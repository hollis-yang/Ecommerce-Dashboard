<script setup>
import { onMounted, ref, onUnmounted, computed} from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import '../../public/static/theme/chalk'

const { proxy } = getCurrentInstance()
const $http = proxy.$http

const trend_ref = ref(null)  // DOM
const allData = ref(null)  // 从服务器返回的所有数据
const showChoice = ref(false)  // 是否显示可选项
const choiceType = ref('map')  // 显示的是哪个表

// echarts 实例在 Vue3 中不能是响应式对象
let chartInstance  // echarts实例

function initChart() {
  chartInstance = echarts.init(trend_ref.value, 'chalk')

  // 图表初始化配置
  const initOption = {
    grid: {
      left: '3%',
      top: '35%',
      right: '4%',
      bottom: '1%',
      containLabel: true // 使距离包含坐标轴上的label文字
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false  // 折线和坐标轴没有间隙
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      left: 20,
      top: '15%',
      icon: 'circle'
    }
  }
  chartInstance.setOption(initOption)
}

async function getData() {
  // http://127.0.0.1:8888/api/trend
  const { data: ret } = await $http.get('trend')  // 解构ret
  console.log(ret)
  allData.value = ret

  updateChart()
}

function updateChart() {
  // 一个折线图的颜色由半透明 -> 全透明
  // 半透明的颜色值
  const colorArr1 = [
    'rgba(11, 168, 44, 0.5)',
    'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)',
    'rgba(254, 33, 30, 0.5)',
    'rgba(250, 105, 0, 0.5)'
  ]
  // 全透明的颜色值
  const colorArr2 = [
    'rgba(11, 168, 44, 0)',
    'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)',
    'rgba(254, 33, 30, 0)',
    'rgba(250, 105, 0, 0)'
  ]

  // 数据处理
  const timeArr = allData.value.common.month  // x轴类目轴数据, 所有x轴的数据
  // y轴数据
  const valueArr = allData.value[choiceType.value].data  // 地区销量趋势
  console.log(valueArr)

  // 准备 series: [{type: ..., data: ...}, {}, {}, ...]
  const seriesArr = valueArr.map((item, index) => {
    return {
      name: item.name,  // 用于图例匹配
      type: 'line',
      data: Array.from(item.data),
      stack: choiceType.value,  // stack 设置为相同的字符串的数据会显示在同一堆叠图上
      areaStyle: {
        color: {
          // areaStyle颜色渐变
          type: 'linear',  // 线性渐变
          // 渐变方向 ↓
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: colorArr1[index] // 0% 处的颜色
          }, {
            offset: 1, color: colorArr2[index] // 100% 处的颜色
          }],
        }
      }
    }
  })
  // 准备图例
  const legendArr = valueArr.map(item => {
    return item.name
  })  // [上海, 北京, ...]

  // 图表数据配置
  const dataOption = {
    legend: {
      data: legendArr
    },
    xAxis: {
      data: timeArr
    },
    series: seriesArr
  }
  chartInstance.setOption(dataOption)
}

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

// 获取下拉框的可选图表名称
const selectTypes = computed(() => {
  if (!allData.value) {
    return []
  } else {
    // 过滤当前选中的标题
    return allData.value.type.filter(item => {
      return item.key !== choiceType.value
    })
  }
})

// 计算需要显示的标题 => choiceType
const showTitle = computed(() => {
  if (!allData.value) {
    return []
  } else {
    return allData.value[choiceType.value].title
  }
})

// 处理点击事件确定选择了哪个表
function handleSelect(currentType) {
  choiceType.value = currentType
  // 刷新图表
  updateChart()
  // 隐藏下拉框
  showChoice.value = false
}
</script>

<template>
  <div class="com-container">
    <div class="title">
      <span>{{ showTitle }}</span>
      <!-- 响应span点击事件改变showChoice -->
      <span class="iconfont title-icon" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-con" v-show=showChoice>
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref">
    </div>
  </div>
</template>

<style scoped lang="less">
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>