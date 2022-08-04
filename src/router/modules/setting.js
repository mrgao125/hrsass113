// 公司设置
import layout from '@/layout'
export default {
    path: '/setting',
    name: 'settings', // 命名settings 是为了和权限标识对应
    component: layout,
    children: [{
        path: '',
        name: 'settings',
        component: () =>
            import ('@/views/setting'),
        meta: {
            title: '公司设置',
            icon: 'setting'
        }
    }]
}