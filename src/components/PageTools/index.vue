<!-- 主体的头部公共组件 -->
<template>
    <el-card class="page-tools">
        <el-row type="flex" justify="space-between" align="middle">
            <el-col>
                <!-- 前插槽 -->
                <div class="before" v-if="showBefore">
                    <i class="el-icon-info"></i>
                    <slot name="before" />
                </div>

            </el-col>
            <el-col>
                <!-- 后插槽 -->
                <el-row type="flex" justify="end">
                    <slot name="after" />
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
// 组件可以显示左侧内容，也可以显示右侧内容，如果左侧不传内容，图标不应该显示
props: {
    // 控制头部 图标是否显示
    showBefore: {
        required: true,
        default:false
    }
},
components: {},
data() {
//这里存放数据
return {

}
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {

},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeUpdate() {}, //生命周期 - 更新之前
beforeDestroy() {}, //生命周期 - 销毁之前
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>