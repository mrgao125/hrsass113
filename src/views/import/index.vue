<template>
    <upload-excel :on-success="success"></upload-excel>
</template>

<script>
import { importEmployees } from '@/api/employees'  // 该接口data需要传一个数组参数
export default {
  data() {
      return {
        
      }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 分析组件实例 判断需要定义该发放
   async success({ header, results }) {
        // header 和 results中的数据 是中文  需要转化为英文
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '聘用形式':'formOfEmployment'
        }
        const formOfEmploymentRelations = {
          // 根据系统设定，定义 聘用形式关联数据
          '正式':1,
          '非正式':2
        }
        // 方法一
        // let arr = [] // 接收数据的数组
        // results.forEach(item => {
        //   // Object.keys() ES6方法 返回对象的 属性 组成的 数组
        //   let userInfo = {}
        //   console.log(item)
        //     Object.keys(item).forEach(key => {
        //       // key是中文
        //       userInfo[userRelations[key]] = item[key]  // 将原来中文对应的值，给英文对应的值
        //     })
        //     arr.push(userInfo)
        // })
        // 数组的 map() 方法 返回符合条件的新数组
        let newArr = results.map(item => {
          let userInfo = {}
          Object.keys(item).forEach(key => {
            if(userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime'){
              // 后端接口限制了不能是字符串， 要求转化成时间类型，所有转化后必须new Date()
                userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样才能传入数据库
            }else if(userRelations[key] === 'formOfEmployment'){
              // 根据数据结构  调整 导入 部门的数据
              userInfo[userRelations[key]] = formOfEmploymentRelations[item[key]]
            }else {
              userInfo[userRelations[key]] = item[key] // 将中文对应的值，赋值给英文对应的值
            }
          })
          return userInfo
        })
        await importEmployees(newArr)  // 发送请求 接收一个数组
        this.$message.success('导入excel成功')
        this.$router.back() // 回到上一个页面
    },
      // 转化excel 时间格式的方法
      formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
