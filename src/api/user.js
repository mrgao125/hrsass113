import request from '@/utils/request'

// 登录接口封装
export function login(data) {
    return request({
        method: 'POST',
        url: '/sys/login',
        data
    })
}
// 获取用户信息
export function getUserInfo() {
    return request({
        method: 'POST',
        url: '/sys/profile',
    })
}
// 根据用户id获取用户详情
export function getUserDetailById(userId) {
    return request({
        method: 'GET', // axios 默认类型是get   method可以省略
        url: `/sys/user/${userId}`
    })
}