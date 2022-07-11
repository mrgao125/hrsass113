<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :showBefore="true">
      <!-- 插槽两种写法： slot="name"  或者 v-slot:name 标签外必须加template 且写在template上 -->
      <span slot="before">待办事项10件</span>
      <template  v-slot:after>
        <el-button type="primary">导入excel</el-button>
      </template>
    </page-tools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
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
