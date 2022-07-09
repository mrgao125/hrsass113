// 工资管理
import layout from '@/layout'
export default {
    path: '/salarys',
    name: 'salarys',
    component: layout,
    children: [{
        path: '',
        component: () =>
            import ('@/views/salarys'),
        meta: {
            title: '工资',
            icon: 'money'
        }
    }]
}