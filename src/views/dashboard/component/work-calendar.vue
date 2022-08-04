<template>
    <!-- 工作日历  -->
    <div>
        <!-- 年月 -->
        <el-row type="flex" justify="end">
            <el-select @change="dateChange" size="mini" style="width: 7vw" v-model="currentYear">
                <!-- 年  用组件的给定一个日期 用日期获取年  年获取前五年 + 后五年 -->
                <el-option
                  v-for="item in yearList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
            </el-select>
            <el-select @change="dateChange" size="mini" style="width: 4vw; margin-left: 0.5vw" v-model="currentMonth">
                <el-option
                  v-for="item in 12"
                  :key="item"
                  :label="item"
                  :value="item"
                />
            </el-select>
        </el-row>
        <!-- 放置日历组件 -->
        <el-calendar v-model="currentDate">
            <!-- date 当前单元格日期 data 是 对象 对象里有要显示的 day -->
            <template
              slot="dateCell"
              slot-scope="{date, data}"
              > 
                <div class="date-content">
                    <span calss="text"> {{data.day | getDay}} </span>
                    <span class="rest" v-if="isWeek(date)">休息</span>
                </div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
export default {
  data() {
      return {
        yearList: [], // 要遍历年的数组
        currentYear: null, // 当前年份
        currentMonth: null, // 当前月份
        currentDate: null // 当前日期  el-calendar 中绑定值
      }
  },
  name: 'WorkCalendar',
  filters: {
    getDay(value) {
        const day = value.split('-')[2]
        return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
        type: Date,
        default: () => new Date()  // 如果没有传递时间,就取当前时间  此处使用构造函数 需要使用回调函数
    }
  },
  created() {
    // 获取当前年份
    this.currentYear = this.startDate.getFullYear()  // 得到当前的年份
    this.currentMonth = this.startDate.getMonth() + 1  // 得到当前月份  月份默认会减 1 所以要 + 1
    // 快速生成数组
   this.yearList = Array.from(Array(11), (v, i) => {
        return this.currentYear + i - 5
    })
    // 当钩子函数初始化完成后 调用方法
    this.dateChange()
  },
  mounted() {

  },
  methods: {
    dateChange() {
        this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`) // 以1月1日开始
    },
    isWeek(date) {
        return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style  scoped lang="scss">
 ::v-deep .el-calendar-day {
    height:  auto;
 }
 ::v-deep .el-calendar-table__row td, ::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
