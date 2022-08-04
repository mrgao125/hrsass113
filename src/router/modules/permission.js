// 权限管理
import layout from '@/layout'
export default {
    path: '/permission',
    name: 'permissions',
    component: layout,
    children: [{
        path: '',
        name: 'permissions',
        component: () =>
            import ('@/views/permission'),
        meta: {
            title: '权限管理',
            icon: 'lock'
        }
    }]
}