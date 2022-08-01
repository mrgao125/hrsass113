<template>
    <el-dialog
      title="分配角色"
      :visible="showRoleDialog"
      @close="btnCancel" 
    >
      <!-- 多选框组 -->
      <el-checkbox-group v-model="roleIds">
        <!-- 要循环的选项 -->
        <!-- label 即充当存储值，又当显示值 如果内部有值则不显示-->
        <el-checkbox
          v-for="item in list"
          :key="item.id"
          :label="item.id"
          >
          {{ item.name }}
          </el-checkbox>
      </el-checkbox-group>
      <!-- 定义footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRole } from '@/api/employees'
export default {
  data() {
      return {
        page: {
            page:1,
            pagesize: 20
        },
        list: [], // 当前所有角色的 id
        roleIds: []  // 负责存储当前用户 所拥有的 角色id
      }
  },
  props: {
    showRoleDialog:{
        type: Boolean,
        default: false
    },
    userId: {
        // 当前点击处理哪个用户
        type: String,
        default: null,
        required: true
    }
  },
  created() {
    this.getRoleList()
  },
  mounted() {

  },
  methods: {
    async getRoleList() {
        const { rows } = await getRoleList(this.page) // 取20条记录
        this.list = rows // 获取到的角色列表
    },
    async getUserDetailById(id) { // 引入props赋值渲染是异步的，所以 不能使用this.userId 
        // 这个方法是给父组件调用的
        const { roleIds } = await getUserDetailById(id)
        this.roleIds = roleIds 
    }, //获取当前用户的 角色 权限 roleId
    btnCancel() {
        this.roleIds = [] // 还原数据
        this.$parent.showRoleDialog = false // 关闭弹层
    },
    async btnOk() {
        // 添加角色权限
        await assignRole({ id: this.userId, roleIds: this.roleIds }) 
        this.$message.success('角色设置成功') 
        this.$emit('update:showRoleDialog', false)  // sync 写法改变props 关闭弹层
        // this.$parent 使用较少
    }
  }
}
</script>

<style scoped lang="scss">

</style>
