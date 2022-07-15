<template>
    <el-dialog 
      :visible="showDialog"
      title="新增员工"
      @close="btnCancel"
      >
        <!-- 表单 -->
        <el-form label-width="120px" :model="employeeFormData" ref="employeeForm" :rules="rules">
            <el-form-item label="姓名" prop="username">
                <el-input v-model="employeeFormData.username" style="width:50%" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="employeeFormData.mobile" style="width:50%" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker type="date" v-model="employeeFormData.timeOfEntry" style="width:50%" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="employeeFormData.formOfEmployment" style="width:50%" placeholder="请选择聘用形式">
                    <el-option 
                        v-for="item in EmployeeEnum.hireType"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工号" prop="workNumber">
                <el-input v-model="employeeFormData.workNumber" style="width:50%" placeholder="请输入工号"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="departmentName">
                <el-input 
                    v-model="employeeFormData.departmentName" 
                    style="width:50%" 
                    placeholder="请输入部门" 
                    @focus="getDepartments"
                    >
                </el-input>
                <!-- 放置一个树形组件 -->
                <el-tree 
                    v-loading="loading" 
                    :data="treeData" 
                    :props="defaultProps" 
                    :default-expand-all="true"
                    v-if="showTree"
                    @node-click="handleClick"
                    ></el-tree>
            </el-form-item>
            <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker type="date" v-model="employeeFormData.correctionTime" style="width:50%" placeholder="请输入转正时间"></el-date-picker>
            </el-form-item>  
        </el-form>
        <!-- 确定和取消按钮 -->
        <el-row slot="footer" type="flex" justify="center" style="margin-bottom:20px">
            <el-col :span="6">
                <el-button size="small" @click="btnCancel">取消</el-button>
                <el-button size="small" type="primary" @click="btnOk">确定</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入枚举对象
import { transListToTreeData } from '@/utils/index'
import { validMobile } from '@/utils/validate'
import { getDepartments } from '@/api/departments'
export default {
    data() {
      // 手机号校验
      const validateMobile = (rule ,value, callback) => {
        if(!validMobile(value)) {
            callback(new Error('手机格式不正确'))
        }else {
            callback()
        }
      }
      return {
        EmployeeEnum, // 引入聘用形式数据
        employeeFormData: {
            username:'',
            mobile:'',
            workNumber:'',
            departmentName:'',
            formOfEmployment: '',
            timeOfEntry:'',
            correctionTime: ''
        },
        rules:{
            username: [
                {required:true, message:'姓名不能为空', trigger: 'blur'},
                {min:1, max: 4, message:'用户名为1-4位', trigger: 'blur'}
            ],
            mobile: [
                {required:true, message:'手机号不能为空', trigger: 'blur'},
                {validator:validateMobile, trigger: 'blur'}
                // 手机号校验也可以使用，pattern：/^1[3-9]\d{9}$/ 正则表单式属性校验
            ],
            timeOfEntry:[
                {required:true, message:'请选择入职时间', trigger: 'blur'}
            ],
            formOfEmployment: [
                {required:true, message:'请选择聘用形式', trigger: 'blur'}
            ],
            workNumber: [
                {required:true, message:'请输入工号', trigger: 'blur'}
            ],
            departmentName: [
                // 这里 校验 为什么要设置为change ,如果设置为blur 数据选定之后，仍然提示错误
                {required:true, message:'请选择部门', trigger: 'change'}
            ],
            correctionTime: [
                {required:true, message:'请选择转正时间', trigger: 'blur'}
            ]
        },
        treeData: [], // 定义一个数组，接收树形结构数据
        defaultProps: {
            children: 'children',
            label: 'name'
        }, // 配置 el-tree 的结构 属性
        loading: false,  // 控制部门数据加载状态
        showTree: false  // 默认不显示树形结构
      }
    },
  props:{
    showDialog:{
        type:Boolean,
        default:false
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    async getDepartments() {
        this.showTree = true  // 显示树形组件
        this.loading = true // 加载状态
        const { depts } = await getDepartments()
        this.treeData = transListToTreeData(depts, '')
        this.loading = false // 关闭加载
    },
    // 处理el-tree 点击事件
    handleClick(data) {
        this.employeeFormData.departmentName = data.name // 将选定数据赋值给表单
        this.showTree = false // 关闭树形结构
    },
    // 点击确定事件
    async btnOk() {
        try {
            await this.$refs.employeeForm.validate()  // 手动校验表单
            await addEmployee(this.employeeFormData) // 新增数据
            // this.$emit('addEmployee')  // 触发新增员工,告知父组件更新角色列表
            // this.$emit('update:showDialog',false) // 语法糖自定义事件
            // $parent 是父组件实例
            this.$parent.getEmployeeList && this.$parent.getEmployeeList()  // 调用父组件的方法
            this.$parent.showDialog = false  // 关闭弹层
            this.$message.success('添加员工成功')
        } catch (error) {
            console.log(error)
        }
    },
    // 点击取消
    btnCancel() {
        // 初始化表单数据
        this.employeeFormData = {
            username:'',
            mobile:'',
            workNumber:'',
            departmentName:'',
            formOfEmployment: '',
            timeOfEntry:'',
            correctionTime: ''
        }
        this.$refs.employeeForm.resetFields() // 清空表单校验
        this.$emit('update:showDialog',false) // 关闭弹层
    }
  }
}
</script>

<style scoped lang="scss">

</style>
