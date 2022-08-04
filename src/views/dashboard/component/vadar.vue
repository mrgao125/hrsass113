<template>
    <div ref="myDiv" class="radar-echart">
        <!-- 使用echarts 必须给div宽和高,否则数据不会显示 -->
    </div>
</template>

<script>
// 完整加载
// import * as echarts from 'echarts'
// 按需加载 雷达图
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])
export default {
  data() {
      return {

      }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv)  // 得到一个图表实例
    myChart.setOption({
        title: {
          text: '绩效分布'
        },
        // 标记 项目
        legend: {
          data: ['张三', '李四']
        },
        radar: {
          // shape: 'circle', 每个区域的最高数值
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        //  每一项数据
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [80, 90, 80, 100, 50, 30],
                name: '张三'
              },
              {
                value: [90, 100, 50, 60, 80, 100],
                name: '李四'
              }
            ]
          }
        ]
    })
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
    .radar-echart {
        width: 600px;
        height: 400px;
    }
</style>
