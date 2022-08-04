// 导出员工的路由规则
import layout from '@/layout'
export default {
    // 路由规则
    path: '/employees',
    name: 'employees', // 给一级路由加一个name属性，后面做权限会用到
    component: layout,
    children: [{
        path: '', // 这里path 不写的时候  表示，/employees 不但有布局layout 还有员工主页,显示一级路由，二级组件
        name: 'employees',
        component: () =>
            import ('@/views/employees'),
        meta: {
            title: '员工管理',
            icon: 'people'
        } // 路由的元信息，存储数据的地方，可以放任何内容
    }, {
        path: 'detail/:id',
        hidden: true, // 表示内容不在左侧内容显示
        component: () =>
            import ('@/views/employees/detail'),
        meta: {
            title: '员工详情'
        }
    }, {
        path: 'print/:id', // 员工二级路由id后面加 ? 表示此参数可传可不传
        component: () =>
            import ('@/views/employees/print.vue'),
        hidden: true,
        meta: {
            title: '员工打印'
        }
    }]
}