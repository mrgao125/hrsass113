<template>
    <div>
        <svg-icon 
          icon-class="fullscreen" 
          style="color:#fff; width: 20px; height: 20px" 
          @click="changeScreen"
        />
    </div>
</template>

<script>
import ScreenFull from 'screenfull'  // 引入全屏插件
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
    changeScreen() {
        // document.documentElement.requestFullscreen() 原生方式全屏
        if(!ScreenFull.isEnabled) {
            // 判断当前全屏能否执行 
            this.$message.warning('当前全屏组件不可用')
            return 
        }
        ScreenFull.toggle()  // 切换全屏  既可以全屏 也可以退出全屏
        
    }
  }
}
</script>

<style scoped lang="scss">

</style>
