<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部-->
      <el-card class="tree-card">
        <!-- 放置结构内容 tree-tools组件-->
        <tree-tools :tree-node="company" :isRoot="true" @addDepts="addDepts"></tree-tools>
        <!-- 放置一个el-tree  -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会显示多次，有多少个节点，就会显示多少次 -->
          <!-- 作用域插槽 slot-scope="obj" data 每个节点的数据-->
          <tree-tools 
            slot-scope="{ data }" 
            :tree-node="data" 
            @addDepts="addDepts"
            @delDepts="getDepartments"
            @editDepts="editDepts"
            ></tree-tools>
        </el-tree>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <add-dept
      ref="addDept"
      :showDialog.sync="showDialog" 
      :treeNodeFromAddDepts="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
import AddDept from './components/add-depart.vue'
export default {
  data() {
    return {
        departs: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        company: {
          name:'',
          manager:''
        },  //头部的数据结构
        showDialog: false,  // 添加部门弹层，默认不显示
        node: null // 记录当前点击的节点
      }
  },
  components: { TreeTools, AddDept},
  created () {
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager:'负责人',id:''}
      this.departs = transListToTreeData(res.depts, '')
    },
    // 监视tree-tools中触发的添加部门自定义事件
    // node是我们当前点击的节点
    addDepts(node) {
      this.showDialog = true  // 显示弹层
      this.node = node 
    },
    editDepts(node) {
      this.showDialog = true  // 显示弹层
      this.node = node 
      // 父组件调用子组件的 方法 ref 获取组件 的this实现
      this.$refs.addDept.getDepartmentsDetail(node.id)
    }
  }

}
</script>

<style lang="scss" scoped>
  .dashboard-container {
    .app-container {
      .tree-card {
        padding: 30px  100px;
        font-size:14px;
      }
    }
  }
</style>