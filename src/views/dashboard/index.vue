<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 头部导航 -->
    <page-tools :showBefore="true">
      <!-- 插槽两种写法： slot="name"  或者 v-slot:name 标签外必须加template 且写在template上 -->
      <span slot="before">待办事项10件</span>
      <template  v-slot:after>
        <el-button type="primary">导入excel</el-button>
      </template>
    </page-tools>
    <!-- 下载 / 上传excel组件 -->
    <upload-excel></upload-excel>
    <!-- 图片上传组件 -->
    <image-upload></image-upload>
    <!-- 电话号码复制功能 -->
    <div style="margin-top: 5vh">
      快递单号:
      <span>{{ CopyValue }}</span>
      <el-button 
        round size="small" 
        style="margin-left: 10px" 
        v-clipboard:copy="CopyValue"
        v-clipboard:success="CopySuccess"
        v-clipboard:error="CopyError"
        >
        复制
        </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      CopyValue: '123456789'
    }
  },
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    // 方法1 全局注册使用
    CopySuccess(e) {
      console.log(e)
      this.$message.success('复制成功')
    },
    CopyError(e) {
      console.log(e)
      this.$message.warning('复制失败')
    }
    // 方法二 组件内使用
    // Copy() {
    //   // 传入参数是 对应要复制 标签的类名
    //   let clipboard = new VueClipboard('.express-number')
    //   clipboard.on('success', e => {
    //     this.$message.success('复制成功')
    //     // 释放内存
    //     clipboard.destroy()
    //   })
    //   clipboard.on('error', e => {
    //     this.$message.warning('该浏览器不支持复制')
    //     // 释放内存
    //     clipboard.destroy()
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
