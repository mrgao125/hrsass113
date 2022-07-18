<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :showBefore="true">
        <!-- 左侧显示总记录数，右侧显示按钮 插槽两种用法-->
        <span slot="before">共{{ page.total }}条数据</span>
        <template slot="after">
          <el-button size="small" type="danger" @click="exportDate">excel导出</el-button>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-table
       :data="employeesData"
       style="width: 100%"
       border
       v-loading="loading"
      >
        <el-table-column sortable label="序号" type="index"></el-table-column>
        <el-table-column sortable label="姓名" prop="username"></el-table-column>
        <el-table-column sortable label="头像">
          <el-image
            :src="employeesData.staffPhoto"
          />
        </el-table-column>
        <el-table-column sortable label="手机号" prop="mobile"></el-table-column>
        <el-table-column sortable label="工号" prop="workNumber"></el-table-column>
        <el-table-column sortable label="聘用形式" prop="formOfEmployment" :formatter="formatEmployee"></el-table-column>
        <el-table-column sortable label="部门" prop="departmentName"></el-table-column>
        <!-- 作用域插槽和过滤器实现 -->
        <el-table-column sortable label="入职时间" prop="timeOfEntry">
          <template v-slot="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column sortable label="转正时间" prop="correctionTime">
          <template v-slot="{ row }">
            {{ row.correctionTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column sortable label="账号状态" prop="enableState">
          <template v-slot="{ row }">
            <!-- el-swich 可以使用v-model 或者value 控制 开关 -->
            <el-switch
              v-model="row.enableState"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          @current-change="changePage"
          layout="prev, pager, next"
          :total="page.total"
          :page-size="page.size"
        ></el-pagination>
      </el-row>
      <!-- 新增员工组件 -->
      <!-- sync修饰符 子组件改变父组件 数据的 语法糖 相当于自定义事件 -->
      <add-employee
        :showDialog.sync="showDialog"
      />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'  // 引入员工的枚举对象
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  data() {
    return {
      employeesData:[],
      page: {
        page: 1, //当前页
        size: 10,
        total: 0  // 页码总数
      },
      loading: false,  // 加载遮罩层
      showDialog: false // 控制弹层显示，默认关闭
    }
  },
  components: { AddEmployee },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const {rows, total}= await getEmployeeList(this.page)
      this.employeesData = rows
      this.page.total = total
      this.loading = false
    },
    changePage(newPage) {
      // newPage 参数会获取当前 页码
      this.page.page = newPage
      this.getEmployeeList()  // 更新数据
    },
    // 格式化员工数据 聘用形式
    formatEmployee(row, column, cellValue, index) {
      // 此方法内有遍历，执行次数和列表行数一致
      // 要去找1所对应的值 (el-table-column 的 formatter 属性实现) cellValue 可以获取单元格的值
      // 此处 未使用 全等，因为vue 会将 数值类型 变为字符串类型 find 会返回找到的第一个值
      const obj = EmployeeEnum.hireType.find(item => item.id == cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        // 点击确定 调用接口
        await deleteEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList() // 重新拉取列表
      } catch (error) {
        console.log(error)
      }
    },
    // 导出文件方法
    exportDate() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // excel 是引入文件 导出的对象  两个条件，表头， 数据
        const { rows } = await getEmployeeList({
          page:1,
          size:this.page.total
        })
        // 转化数据类型
        const data = this.formatJson(headers,rows)
        const multiHeader = [['姓名','主要信息','', '', '', '','部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          //  employeesData 这个数据只有10条数
          data:data,
          filename:'员工信息',
          multiHeader,  // 复杂表头
          merges  // 合并选项
        })
        // excel.export_json_to_excel({
        //   header:['姓名','工资'], // 表头
        //   data: [['张三',3000],['李四',5000]],  // 内容数据，数组里面套数组
        //   filename:'员工信息',
        // })
        // [{userName:'张三'}]  => [username,'张三'] 此处需要进行数据转化
        // 并且需要根据表头 对应顺序
        // 要求 转出的标题 是中文  中英文 转化 
      })
    },
    // excel 导出数据格式化数据  data [[]]
    formatJson(headers,rows) {
      // 传递表头数据和列表数据传入
      return rows.map(item => {
        // 根据headers里面的顺序转,遍历标题
        // object.key 获取['手机号','入职日期']
        return Object.keys(headers).map(key => {
          // 需要判断字段
          if(headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化时间
            return formatDate(item[headers[key]])
          }else if(headers[key] === 'formOfEmployment') {
            const obj1 = EmployeeEnum.hireType.find(obj => obj.id == item[headers[key]])
            return obj1 ? obj1.value : '未知'
          }else {
            return item[headers[key]]
          }
        })
      })
      // 如果不判断 部门 和 聘用形式，可以代码精简 
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    }
  }
}
</script>

<style>

</style>