// 组织架构管理
import layout from '@/layout'
export default {
    path: '/departments',
    name: 'departments',
    component: layout,
    children: [{
        path: '',
        name: 'departments',
        component: () =>
            import ('@/views/departments'),
        meta: {
            title: '组织架构',
            icon: 'tree'
        }
    }]
}