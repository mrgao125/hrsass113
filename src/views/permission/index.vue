<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <el-button slot="after" size="small" type="primary" @click="addPerssion('0',1)">添加菜单</el-button>
      </page-tools>
      <!-- 表格  -->
      <!-- 指定id为唯一树形标识 -->
      <el-table
        :data="permissionList"
        border
        row-key="id"
      >
        <el-table-column label="菜单名称" prop="name"></el-table-column>
        <el-table-column align="center" label="权限标识" prop="code"></el-table-column>
        <el-table-column align="center" label="描述" prop="description"></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 这个添加按钮只在访问权的层级显示  type=1时 显示添加按钮，type=2时候不显示(后端数据) 现在树形结构只有两层-->
            <el-button type="text" v-if="row.type === 1" @click="addPerssion(row.id, 2)">添加权限</el-button>
            <el-button type="text" @click="editPerssion(row.id)">编辑</el-button>
            <el-button type="text" @click="deletePerssion(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑权限弹层 -->
    <el-dialog
      :visible="showAddDialog"
      :title="showText"
      @close="btnCancel"
      >
      <!-- 表单 -->
      <el-form ref="permForm" label-width="6vw" :model="formData" :rules="rules">
        <el-form-item label="权限名称"  prop="name">
          <el-input style="width: 40vw" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识"  prop="code">
          <el-input style="width: 40vw" v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input style="width: 40vw" v-model="formData.description"></el-input>
        </el-form-item>
        <el-form-item label="企业可见">
          <el-switch
            v-model="formData.enVisible"
            active-text="可见"
            inactive-text="不可见"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 确定和取消按钮 --> 
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPerssionList, addPerssion, updatePerssionById, deletePerssionById, getPerssionDetail} from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      permissionList: [], // 权限列表
      showAddDialog: false, // 添加和编辑 弹层 默认关闭
      formData: {
        name: '',  // 权限名称
        code: '',  // 权限标识
        description: '', // 权限描述
        enVisible: '0' // 默认开启 0 不激活，1 开启
      }, // 表单数据
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPerssionList()
  },
  methods: {
    // 获取角色列表
    async getPerssionList() {
      this.permissionList = transListToTreeData(await getPerssionList(), '0')
    },
    // 新增角色权限
    addPerssion(pid, type) {
      // pid 传 '0' 代表根节点新增  type  1 代表页面权限  2 代表 按钮权限
      this.showAddDialog = true // 显示弹层
      this.formData.pid = pid 
      this.formData.type = type
    },
    // 编辑权限
    async editPerssion(id) {
      this.formData =  await getPerssionDetail(id) // 通过接口获取详情，回写
      this.showAddDialog = true // 显示弹层
    },
    // 删除权限
    async deletePerssion(id) {
      // 直接调接口
      try {
        await this.$confirm('确定删除该权限吗')  // 删除提示
        await deletePerssionById(id)  // 删除角色权限
        this.$message.success('删除成功')
        this.getPerssionList()  // 更新数据
      } catch (error) {
        this.$message.error('删除失败')
      } 
    },
    btnCancel() {
      // 初始化表单数据
      this.formData = {
        name: '',
        code: '',  
        description: '', 
        enVisible: '0' 
      } 
      // 移除校验
      this.$refs.permForm.resetFields()
      this.showAddDialog = false // 关闭弹层
    },
    async btnOk() {
      try {
        await this.$refs.permForm.validate()  // 表单校验validate()传入回调函数或者promise
        if(!this.formData.id) {
          // 表单数据中没有id 则进行新增操作
          await addPerssion(this.formData) // type 1代表根节点 2 非根节点
        } else {
          // 编辑操作
          await updatePerssionById(this.formData)
        }
        this.getPerssionList()  // 重新获取列表数据 
        this.showAddDialog = false // 关闭弹层
        this.$message.success('操作成功')
      } catch (error) {
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style>

</style>