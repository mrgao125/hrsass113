<template>
    <!-- 弹层组件 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
        <!-- 表单数据 -->
        <el-form label-width="120px" :rules="rules" :model="formData" ref="deptForm">
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
                <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
                <el-select 
                placeholder="请选择" 
                v-model="formData.manager" 
                @focus.native="getEmployeeSiple">
                    <el-option 
                        v-for="item in peoples"
                        :key="item.id"
                        :label="item.username" 
                        :value="item.username"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="inintroduce">
                <el-input v-model="formData.inintroduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
            </el-form-item>
        </el-form>
        <!-- 确定和取消 -->
        <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
                <el-button size="small" @click="btnCancel">取消</el-button>
                <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getDepartments, addDepartment, getDepartmentsDetail, updateDepartments} from '@/api/departments'
import { getEmployeeSiple } from '@/api/employees'
export default {
props: {
    // 控制弹层显示隐藏数据
    showDialog: {
        type:Boolean,
        default:false
    },
    // 当前添加部门的对象
    treeNodeFromAddDepts: {
        type: Object,
        default: null
    }
},
computed: {
    showTitle() {
        return this.formData.id ? '编辑部门' : '新增部门'
    }
},
data() {
// 检查部门名称是否重复
const checkNameRepeat = async(rule, value, callback) => {
    // value 是部门名称(表单数据)  要去和同级部门下比较，有没有相同的名称，相同的 不能通过， 不同的，可以通过
    const { depts } = await getDepartments() 
    let isRepeat = false
    if(this.formData.id) {
        // 编辑功能校验
        // 编辑的数据，数据库里面有   判断： 同级部门下，编辑的名字，不能和其他名字重复
        // 首先找到同级部门  排除自己  pid相同的是同级部门   id是每个部门独有的属性
         isRepeat = depts.filter(item => item.pid === this.treeNodeFromAddDepts.pid && item.id !== this.treeNodeFromAddDepts.id).some(item => item.name === value)
    }else{
        // 去找同级部门下，有没有value相同的数据 
        // filter 函数，根据条件筛选数组，返回新数组，some函数 根据条件遍历 数组返回 布尔值
        isRepeat = depts.filter(item => item.pid === this.treeNodeFromAddDepts.id).some(item  => item.name === value)
    }
    // 如果isRepert 是true 表示找到同样的名字
    isRepeat ? callback(new Error(`同级部门下已存在${value}部门`)) : callback()
}
// 检查编码和所有的部门是否重复
const checkCodeRepeat = async(rule, value, callback) => {
    const { depts } = await getDepartments()
    let isRepeat = false
    if(this.formData.id) {
        // 编辑模式下数据校验
        depts.filter(item => item.id !== this.treeNodeFromAddDepts.id).some(item => item.code ===value && value)
    }else {
        // 新增模式下数据校验
        // 对比所有数据和填入 code 是否重复  因为数据库，可能没有code 所有判断 value值必须存在code数据
        isRepeat = depts.some(item => item.code === value && value) 
    }
    isRepeat ? callback(new Error(`该编码${value}已存在`)) : callback()
}
return {
    formData: {
        name: '',
        code: '',
        manager: '',
        inintroduce: ''
    },
    rules: {
        name: [
            {required: true, message:'请输入部门名称', tigger: 'blur'},
            {min: 1, max: 50, message:'长度在1-50个字符', tigger: 'blur'},
            {tigger:'blur', validator: checkNameRepeat}
        ],
        code: [
            {required: true, message: '请输入部门编码', tigger: 'blur'},
            {min: 1, max: 50, message: '长度在1-50个字符', tigger: 'blur'},
            {tigger:'blur', validator: checkCodeRepeat}
        ],
        manager: [
            {required: true, message: '请选择部门负责人', tigger: 'blur'},
        ],
        inintroduce: [
            {required: true, message:'请输入部门简介', tigger: 'blur'},
            {min: 1, max: 300, message: '长度在1-300个字符', tigger: 'blur'}
        ]
    },
    peoples:[] // 部门负责人数组
}
},
//方法集合
methods: {
    async getEmployeeSiple() {
       const result =  await getEmployeeSiple()
       this.peoples = result
    },
    // 获取详情方法
    async getDepartmentsDetail(id) {
       this.formData = await getDepartmentsDetail(id)
       // 不能直接使用 this.treeNodeFromAddDepts.id 因为props传值是异步，有可能获取不到数据
    },
    // 提交表单
    btnOK() {
        // 手动校验表单
        this.$refs.deptForm.validate(async isOk => {
            if(isOk) {
                if(this.formData.id) {
                    // 有id 编辑功能  
                    await updateDepartments(this.formData)
                } else {
                    // 表单校验通过 可以提交了
                    // 这里将 pid 设置为 当前部门节点的 id
                    // 发送请求
                    // 没有id 将 新增功能
                    await addDepartment({
                        ...this.formData, pid: this.treeNodeFromAddDepts.id
                    })
                }
                // 告诉父组件更新数据
                this.$emit('addDepts') // 触发自定义事件
                // 告诉父组件修改 showDialog   通过.sync 修饰符  语法糖，相当于自定义事件
                this.$emit('update:showDialog', false)
                // 关闭弹层会调用 el-dialog 的close事件 会清除校验  所有这里不用再重置数据了
                
            }
        })
    },
    // 关闭弹层，取消校验
    btnCancel() {
        // 重置数据 因为resetFields只能重置表单上的数据，非表单上的数据，不能
        this.formData = {
            name: '',
            code: '',
            manager: '',
            inintroduce: ''
        }
        // 关闭弹层
        this.$emit('update:showDialog', false)
        // 清除校验  并且会清除数据 ,可以重置数据，但是只能重置定义在data中的数据
        this.$refs.deptForm.resetFields()
    }

},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
    this.getEmployeeSiple()
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
</style>