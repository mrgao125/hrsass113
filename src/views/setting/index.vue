<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 公司设置内容 -->
      <el-card>
        <!-- 公司角色 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <!-- 左侧内容 -->
            <el-row>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
            </el-row>
            <el-table :data="tableData" border>
              <el-table-column label="序号" type="index" width="120"  align="center"></el-table-column>
              <el-table-column label="角色" prop="name" width="240"  align="center"></el-table-column>
              <el-table-column label="描述" prop="description"  align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="assignPermission(scope.row.id)"
                    :disabled="!checkPermission('add-perm')"
                    >分配权限</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="end" align="middle" style="height: 60px">
              <el-pagination 
                :current-page="page.page" 
                :page-size="page.pagesize" 
                :total="page.total" 
                layout="prev, pager, next"
                @current-change="changePage"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <!-- 公司信息  -->
          <el-tab-pane label="公司信息" name="second">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            >
            </el-alert>
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input style="width: 400px" disabled v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input style="width: 400px" disabled v-model="formData.companyAddress"></el-input>
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input style="width: 400px" disabled v-model="formData.companyPhone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input style="width: 400px" disabled v-model="formData.mailbox"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" rows="3" style="width: 400px" disabled v-model="formData.remarks"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="DialogVisible"
      @close="btnCancelRole"
>
      <el-form ref="roleForm" :model="roleFormData" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleFormData.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 取消和确定按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancelRole">取消</el-button>
          <el-button size="small" type="primary" @click="btnOkRole">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个分配权限的弹层  -->
    <el-dialog
      :visible="showPermissionDialog"
      title="分配权限"
      @close="btnCencelPerm"
    >
      <!-- 分配权限 el-tree  -->
      <!-- check-strictly 如果为true 表示父子勾选，不互相关联  false 父子关联-->
      <el-tree 
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        default-expand-all
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectChecked"
      >
      </el-tree>
      <!-- 确定和取消按钮  -->
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCencelPerm">取消</el-button>
          <el-button size="small" type="primary" @click="btnOkPerm">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPermissionToRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPerssionList } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      activeName:'first',
      tableData:[],
      page: {
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      }, // 放置请求的页码数据
      formData: {
        // 公司信息
      },
      DialogVisible: false, // 控制弹层显示隐藏
      // 编辑角色数据
      roleFormData: {
        name: '',
        description: ''
      },
      rules:{
        name:[
            {required:true, message:'请输入角色名称',trigger:'blur'}
        ],
        description: [
            {required:false, message:'请输入角色描述',trigger:'blur'}
        ]
      },
      showPermissionDialog: false, // 分配权限弹层
      permData: [],  // 用于接收权限数据
      defaultProps: {
          children: 'children',
          label: 'name'
      }, // 定义显示字段的名称 和 子字段的名称
      roleId: null,  // 用来记录当前角色 分配权限的 id
      selectChecked: [], // 用来记录当前角色权限值
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  }, 
  created() {
    this.getRoleList()  // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods:{
    // 给角色分配权限功能
    async assignPermission(id) {
      this.permData = transListToTreeData(await getPerssionList(), '0')  // 将获取的数据转为树形结构, 赋值给树形结构数据
      this.roleId = id  // 保存 当前角色 id 数据
      // 获取角色的权限点
      const { permIds } = await getRoleDetail(id)  // 当前角色拥有 的权限点id 组成的数组
      this.selectChecked = permIds // 将角色权限 id 赋值给 el-tree数据
      this.showPermissionDialog = true  // 显示弹层
    },
    // 编辑角色
    async handleEdit(row) {
      this.roleFormData = await getRoleDetail(row.id) // 弹层数据回写
      this.DialogVisible = true  // 显示弹层
    },
    async handleDelete(row) {
      // 删除角色功能
      try {
        await this.$confirm('确认删除该角色吗？')  // 只有点击确定才会进入下面代码
        await deleteRole(row.id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async getRoleList() {
      // 获取角色列表
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.tableData = rows
    },
    async getCompanyInfo() {
      // 获取公司信息
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      // 分页功能
      this.page.page = newPage  // 将当前页码赋值给当前最新页码
      this.getRoleList() // 更新数据
    },
    // 新增方法
    addRole() {
      this.DialogVisible = true  // 显示弹层
    },
    btnCancelRole() {
      // 取消事件
      this.roleFormData = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields() // 移除校验规则 不移除会报错
      this.DialogVisible = false
    },
   async btnOkRole() {
      // 确定事件
      // 手动校验表单 可以用回调函数，也可以用promise写法
      // roleFormData 数据里面有 id 数据，就是编辑，没有就是新增
      try {
        await this.$refs.roleForm.validate() 
        if(this.roleFormData.id) {
           await updateRole(this.roleFormData) // 编辑功能
        }else {
          // 新增功能
          await addRole(this.roleFormData) // 新增功能
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.DialogVisible = false  // 关闭弹层 会触发 el-dialog 的close事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCencelPerm() {
      this.permData = []  // 初始化数据
      this.selectChecked = [] // 清空默认勾选数据
      this.showPermissionDialog = false
    },
    async btnOkPerm() {
      // 调用el-tree 的方法
      // const rusult = this.$refs.permTree.getCheckedKeys()  // 此方法返回 绑定的 node-key 节点设置的数据 key值
      try {
        const result = this.$refs.permTree.getCheckedKeys()  // 获取节点id
        await assignPermissionToRole({permIds: result, id: this.roleId})  // 数据传入有先后顺序，必须先传 permId
         this.$message.success('权限设置成功')
      } catch (error) {
        console.log(error)
        this.$message.error('操作失败')
      }
      this.showPermissionDialog = false // 关闭弹层
    }
  }
}
</script>

<style>

</style>