// 导出审批的路由规则
import layout from '@/layout'
export default {
    // 路由规则
    path: '/approvals',
    name: 'approvals', // 给一级路由加一个name属性，后面做权限会用到
    component: layout,
    children: [{
        path: '', // 这里path 不写的时候  表示，/approvals 不但有布局layout 还有员工主页,显示一级路由，二级组件
        component: () =>
            import ('@/views/approvals'),
        meta: {
            title: '审批',
            icon: 'tree-table'
        } // 路由的元信息，存储数据的地方，可以放任何内容
    }]
}