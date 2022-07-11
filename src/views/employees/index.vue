<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :showBefore="true">
        <!-- 左侧显示总记录数，右侧显示按钮 插槽两种用法-->
        <span slot="before">共{{ page.total }}条数据</span>
        <template slot="after">
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
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
        <el-table-column sortable label="账号状态" prop="enableState">
          <template v-slot="{ row }">
            <el-switch
              :value="row.enableState === 1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'  // 引入员工的枚举对象
export default {
  data() {
    return {
      employeesData:[],
      page: {
        page: 1, //当前页
        size: 10,
        total: 0  // 页码总数
      },
      loading: false  // 加载遮罩层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const {rows, total}= await getEmployeeList(this.page)
      console.log(rows)
      this.employeesData = rows
      this.page.total = total
      this.loading = false
    },
    changePage(newPage) {
      // newPage 参数会获取当前 页码
      this.page.page = newPage
      this.getEmployeeList()  // 更新数据
    },
    // 格式化员工数据
    formatEmployee(row, column, cellValue, index) {
      // 此方法内有遍历，执行次数和列表行数一致
      // 要去找1所对应的值 (el-table-column 的 formatter 属性实现) cellValue 可以获取单元格的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    } 
  }
}
</script>

<style>

</style>