<template>
   <div class="dashboard-container">
    <!-- 头部内容 -->
    <el-card class="header-card">
      <div>
        <div class="fl headL">
          <div class="headImg">
            <!-- 处理默认图片 -->
            <img :src="staffPhoto" v-imagerror="defaultImg">
          </div>
          <div class="headInfoTip">
            <p class="firstChild">早安，{{ name }}，祝你开心每一天！</p>
            <!-- 建立mapGetters 快捷访问实现 -->
            <!-- <p class="lastChild">{{ name }} | {{ company }} - {{ departmentName }}</p> -->
            <!-- 借助辅助函数createNamespacedHelpers实现 -->
            <!-- <p class="lastChild">{{ name }} | {{ userInfo.company }} - {{ userInfo.departmentName }}</p> -->
            <!-- 原始方法实现 -->
            <p class="lastChild">{{ name }} | {{ $store.state.user.userInfo.company }} - {{ $store.state.user.userInfo.departmentName }}</p>
          </div>
        </div>
        <div class="fr" />
      </div>
    </el-card>
    <!-- 主要内容 -->
    <el-row type="flex" justify="space-between">
      <!-- 左侧内容 -->
      <el-col :span="13" style="padding-right:26px">
        <!-- 工作日历 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>
              工作日历
            </span>
          </div>
        <!-- 放置日历组件 -->
          <work-calendar></work-calendar>
        </el-card>
        <!-- 公告 -->
        <el-card class="box-card">
          <div class="advContent">
            <div class="title"> 公告</div>
            <div class="contentItem">
              <ul class="noticeList">
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="">
                    <div>
                      <p><span class="col">朱继柳</span> 发布了 第1期“传智大讲堂”互动讨论获奖名单公布</p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="">
                    <div>
                      <p><span class="col">朱继柳</span> 发布了 第2期“传智大讲堂”互动讨论获奖名单公布</p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item">
                    <img src="@/assets/common/img.jpeg" alt="">
                    <div>
                      <p><span class="col">朱继柳</span> 发布了 第3期“传智大讲堂”互动讨论获奖名单公布</p>
                      <p>2018-07-21 15:21:38</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="11">
        <el-card class="box-card">
          <div class="header headTit">
            <span>流程申请</span>
          </div>
          <div class="sideNav">
            <el-button class="sideBtn" @click="leaveApplication">加班离职</el-button>
            <el-button class="sideBtn">请假调休</el-button>
            <el-button class="sideBtn" @click="$router.push('/users/approvals')">审批列表</el-button>
            <el-button class="sideBtn" @click="$router.push('/users/info')">我的信息</el-button>
          </div>
        </el-card>

        <!-- 绩效指数 -->
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>绩效指数</span>
          </div>
        <!-- 放置雷达图 -->
        <!-- is里面可以绑定data中的变量 也可以写组件的字符串 该-->
          <component :is="'vadar'"></component>  
        </el-card>
        <!-- 帮助连接 -->
        <el-card class="box-card">
          <div class="header headTit">
            <span>帮助链接</span>
          </div>
          <div class="sideLink">
            <el-row>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconGuide" />
                  <p>入门指南</p>
                </a>
              </el-col>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconHelp" />
                  <p>在线帮助手册</p>
                </a>
              </el-col>
              <el-col :span="8">
                <a href="#">
                  <span class="icon iconTechnology" />
                  <p>联系技术支持</p>
                </a>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 电话号码复制功能 -->
    <div style="margin-top: 5vh">
      快递单号:
      <span>{{ CopyValue }}</span>
      <el-button 
        round size="small" 
        style="margin-left: 10px" 
        v-clipboard:copy="CopyValue"
        v-clipboard:success="CopySuccess"
        v-clipboard:error="CopyError"
        >
        复制
        </el-button>
    </div>
    <!-- 离职弹层 -->
    <el-dialog
      :visible="showLeaveDialog"
      title="离职申请"
      @close="btnCancel"
    >
      <!-- 表单内容 -->
      <el-form ref="leaveForm" :model="leaveData" :rules="rules">
        <el-form-item label="期望离职时间" label-width="15%" prop="exceptTime">
          <el-date-picker
            v-model="leaveData.exceptTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="离职原因" label-width="15%" prop="reason">
          <el-input type="textarea" :rows="3" style="width:80%" v-model="leaveData.reason"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="5">
          <el-button size="mini" type="primary" @click="btnOk">提交</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')  // 使用辅助函数
import WorkCalendar from './component/work-calendar.vue'
import Vadar from './component/vadar.vue'
import {startProcess} from '@/api/approvals'
export default {
  data() {
    return {
      CopyValue: '123456789', // 复制快递单号功能
      defaultImg: require('@/assets/common/head.jpg'), // 处理头像默认图片
      showLeaveDialog: false, // 控制离职弹层
      leaveData: {
        exceptTime:'', // 离职时间数据
        reason: '', // 离职原因数据
        processKey: 'process_dimission', // 流程标识 已经提前设定好的 离职审批的标识
        processName: '离职' // 固定数据
      },
      rules:{
        exceptTime: [{required: true, message:'离职时间不能为空', trigger:'blur'}],
        reason: [{required: true, message:'离职原因不能为空', trigger:'blur'}]
      } // 表单校验
    }
  },
  name: 'Dashboard',
  components: {WorkCalendar,Vadar},
  computed: {
    ...mapGetters([
      'staffPhoto','name','company', 'departmentName'
    ]),
    ...mapState(['userInfo'])
  },
  methods: {
    // 方法1 全局注册使用 复制功能
    CopySuccess(e) {
      console.log(e)
      this.$message.success('复制成功')
    },
    CopyError(e) {
      console.log(e)
      this.$message.warning('复制失败')
    },
    // 方法二 组件内使用
    // Copy() {
    //   // 传入参数是 对应要复制 标签的类名
    //   let clipboard = new VueClipboard('.express-number')
    //   clipboard.on('success', e => {
    //     this.$message.success('复制成功')
    //     // 释放内存
    //     clipboard.destroy()
    //   })
    //   clipboard.on('error', e => {
    //     this.$message.warning('该浏览器不支持复制')
    //     // 释放内存
    //     clipboard.destroy()
    //   })
    // }
    leaveApplication() {
      // 点击离职申请
      this.showLeaveDialog = true  
    },
    btnOk() {
      // 提交离职申请  可以使用 promise方法 或者内部传入函数  或者使用 async await
       this.$refs.leaveForm.validate().then(() => {
        return startProcess({...this.leaveData, userId: this.userInfo.userId, username: this.userInfo.username})
      }).then(() => {
         this.$message.success('离职申请提交成功')
         this.showLeaveDialog = false
      }).catch(() => {
        console.log(new Error('接口出错，提交审批失败'))
      })
    },
    btnCancel() {
      // 关闭操作
      this.leaveData = {
        exceptTime:'', // 离职时间数据
        reason: '', // 离职原因数据
        processKey: 'process_dimission', // 流程标识 已经提前设定好的 离职审批的标识
        processName: '离职' // 固定数据
      }
      this.$refs.leaveForm.resetFields() // 重置表单
      this.showLeaveDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;
  li {
    list-style: none;
  }
  .headImg {
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #999;
          img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .headInfoTip {
    padding: 25px 0 0;
    margin-left: 120px;
    p {
      padding: 0 0 15px;
      margin: 0;
      &.firstChild {
        font-size: 24px;
      }
      &.lastChild {
        font-size: 20px;
        color: #7f8c8d;
      }
    }
  }
}

.box-card {
  padding: 5px 10px;
  margin-top: 20px;
  .header {
    span {
      color: #2c3e50;
      font-size: 24px;
    }
    .item {
      color: #97a8be;
      float: right;
      padding: 3px 0;
    }
  }
  .headTit {
    span {
      border-bottom: 4px solid #8a97f8;
      padding-bottom: 10px;
    }
  }
}
.header-card{
  position: relative;
  .header {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
  }
}

.advContent {
  background: #fff;
  border-radius: 5px 5px 0px 0px;
  .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }
  .contentItem {
    padding: 0 30px;
    min-height: 350px;
    .item {
      display: flex;
      padding:18px 0 10px;
      border-bottom: solid 1px #ccc;
      .col {
        color: #8a97f8;
      }
      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 10px;
      }
      p{
        padding: 0 0 8px;
      }
    }
  }
}
.noticeList {
  margin: 0;
  padding: 0;
}
.sideNav,
.sideLink {
  padding: 30px 0 12px;
  .sideBtn {
    padding: 16px 26px;
    font-size:16px;
    margin: 10px 5px;
  }
}
.sideLink {
  text-align: center;
  .icon {
    display: inline-block;
    width: 76px;
    height: 76px;
    background: url('./../../assets/common/icon.png') no-repeat;
  }
  .iconGuide {
    background-position: 0 0;
  }
  .iconHelp {
    background-position: -224px 0;
  }
  .iconTechnology {
    background-position: -460px 0;
  }
}
</style>
