<template>
  <div class="dashboard-container">
    <div class="app-container">
        <!-- 放置一个el-card  -->
        <el-card>
            <el-tabs>
                <el-tab-pane label="登录账户设置">
                    <el-form 
                      label-width="10%" 
                      style="margin-left: 120px; margin-top:30px"
                      :model="userInfo"
                      :rules="rules"
                      ref="userForm"
                    >
                        <el-form-item label="姓名:" prop="username">
                            <el-input style="width:20vw" v-model="userInfo.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码:" prop="password2">
                           <el-input style="width:20vw" type="password" v-model="userInfo.password2"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="medium" @click="saveUser">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="个人详情">
                    
                </el-tab-pane>
                <el-tab-pane label="岗位信息">
                    
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
      return {
        userId: this.$route.params.id, // 直接将路由中的参数赋值给data  路由中:id是params参数  ?id=123,是query参数
        userInfo: {
            username: '',
            password2: '' // 为什么叫passWord2  因为读取出来的password 是密文，密文修改了不清楚规则，通过前端传入 
        },
        rules:{
            username:[{ required: true, message: '姓名不能为空', trigger: 'blur' }],
            password2:[{ required: true, message: '密码不能为空', trigger: 'blur' },{
                min:6, max:9, message: '密码长度6-9位',trigger: 'blur'
            }]
        }
      }
  },
  created() {
    this.getUserDetailById()
  },
  mounted() {

  },
  methods: {
    async getUserDetailById() {
       this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
        this.$refs.userForm.validate().then(async() => {
           await saveUserDetailById({...this.userInfo, password: this.userInfo.password2})
           await this.$message.success('修改账户/密码成功') 
        })  // 浅拷贝，实现对象中 后面元素替换前面元素
        
    }
  }
}
</script>

<style scoped lang="scss">

</style>
