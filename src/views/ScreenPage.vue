<script setup>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
import { ref, nextTick, onMounted } from 'vue'

// 表示各组件的状态(是否放大)
const fullScreenStatus = ref({
  Trend: false,
  Seller: false,
  Map: false,
  Rank: false,
  Hot: false,
  Stock: false
})

// 创建每个组件的ref并存入对象
const trendRef = ref()
const sellerRef = ref()
const mapRef = ref()
const rankRef = ref()
const hotRef = ref()
const stockRef = ref()
const chartComponents = {
  Trend: trendRef,
  Seller: sellerRef,
  Map: mapRef,
  Rank: rankRef,
  Hot: hotRef
}

const changeSize = function (chartName) {
  // 切换全屏状态
  fullScreenStatus.value[chartName] = !fullScreenStatus.value[chartName]
  // 只有调用组件的自适应函数才能让全屏显示正确的图表
  nextTick(() => {
    if (chartName === 'Stock') {
      stockRef.value.updateChart()
      stockRef.value.screenAdapter()
    }
    chartComponents[chartName].value.screenAdapter()
  })
}


// 创建一个ref，用于存储当前时间
const currentTime = ref('')

// 更新当前时间
function updateCurrentTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 在组件挂载后，通过onMounted函数获取当前时间
onMounted(() => {
  updateCurrentTime()
  // 每秒更新一次当前时间
  setInterval(() => {
    updateCurrentTime()
  }, 1000)
})
</script>

<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="">
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <span class="datetime">{{ currentTime }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <!-- 动态绑定是否全屏 -->
        <div id="left-top" :class="[fullScreenStatus.Trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trendRef"></Trend>
          <div class="resize">
            <!-- 全屏 -->
            <span @click="changeSize('Trend')"
              :class="['iconfont', fullScreenStatus.Trend ? 'icon-compress-alt' : 'iconfont icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.Seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="sellerRef"></Seller>
          <div class="resize">
            <!-- 全屏 -->
            <span @click="changeSize('Seller')"
              :class="['iconfont', fullScreenStatus.Seller ? 'icon-compress-alt' : 'iconfont icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.Map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="mapRef"></Map>
          <div class="resize">
            <!-- 全屏 -->
            <span @click="changeSize('Map')"
              :class="['iconfont', fullScreenStatus.Map ? 'icon-compress-alt' : 'iconfont icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.Rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rankRef"></Rank>
          <div class="resize">
            <!-- 全屏 -->
            <span @click="changeSize('Rank')"
              :class="['iconfont', fullScreenStatus.Rank ? 'icon-compress-alt' : 'iconfont icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.Hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hotRef"></Hot>
          <div class="resize">
            <!-- 全屏 -->
            <span @click="changeSize('Hot')"
              :class="['iconfont', fullScreenStatus.Hot ? 'icon-compress-alt' : 'iconfont icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.Stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stockRef"></Stock>
          <div class="resize">
            <!-- 全屏 -->
            <span @click="changeSize('Stock')"
              :class="['iconfont', fullScreenStatus.Stock ? 'icon-compress-alt' : 'iconfont icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 全屏时的样式
.fullscreen {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  >div {
    img {
      width: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 25px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 128px;
    }
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;

  .screen-left {
    height: 100%;
    width: 27.6%;

    #left-top {
      height: 53%;
      position: relative;
    }

    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      height: 46%;
      position: relative;
    }

    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>