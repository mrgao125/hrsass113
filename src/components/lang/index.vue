<template>
    <!-- 下拉菜单点击事件 -->
    <el-dropdown @command="changeLang" trigger="click">
        <!-- 显示图标 -->
        <span>
            <svg-icon 
                icon-class="language" 
                style="color:#fff; width: 20px; height: 20px" 
            />
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command="en">English</el-dropdown-item>
            <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
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
    changeLang(type) {
        // type命名和lang中的字符一致，去进行匹配
        // 设置语言类型  先写入cookie中
        Cookie.set('language', type) // 写入缓存
        // 改变当前的多语言
        this.$i18n.locale = type  // 将当前的多语言类型改成当前的类型
        this.$message.success('切换语言成功')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
