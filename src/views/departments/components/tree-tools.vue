<!-- tree结构组件 -->
<template>
    <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
        <el-col>
              <!-- 左侧内容 -->
              <i v-if="isRoot" class="el-icon-s-home" style="font-size:20px; padding-right: 5px"></i>
              <i v-if="!isRoot" class="el-icon-user-solid" style="font-size:20px; padding-right: 5px"></i>
              <span>{{ treeNode.name }}</span>
        </el-col>
        <el-col :span="4">
             <!-- 右侧内容 -->
              <el-row type="flex" justify="end">
                <el-col>{{ treeNode.manager }}</el-col>
                <el-col>
                  <!-- 下拉菜单 -->
                  <el-dropdown @command="handleCommand">
                    <!-- 内容 -->
                    <span>下拉菜单
                      <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                      <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
                      <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { deleteDepartment, addDepartment} from '@/api/departments'
export default {
components: {},
data() {
//这里存放数据
return {

}
},
props: {
    // 定义传入属性
    treeNode: {
        required: true,
        type: Object
    },
    isRoot: {
      default: false,
      type: Boolean
    }
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  // 点击新增 、 编辑 、 删除时触发
  handleCommand(type) {
    if(type === 'add') {
      // 添加部门
      // 添加子部门，在当前点击的部门，添加子部门
      this.$emit('addDepts',this.treeNode)    // 触发自定义事件，显示弹层
    } else if(type == 'edit') {
      // 编辑部门
      this.$emit('editDepts', this.treeNode)   // 触发自定义事件，显示弹层
    } else {
      this.$confirm('您确定要删除该部门吗?').then(() => {
        return deleteDepartment(this.treeNode.id)
      }).then(() => {
        // 只需要等到成功的时候，调用接口删除了，后端数据变化了，前端没变化 , 重新获取数据
        this.$emit('delDepts')  // 发起自定义事件
        this.$message.success('删除部门成功')
      })
    }
  }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {},
beforeUpdate() {}, //生命周期 - 更新之前
beforeDestroy() {}, //生命周期 - 销毁之前
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>