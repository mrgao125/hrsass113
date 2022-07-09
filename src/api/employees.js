import request from '@/utils/request'

// 获取员工列表
export const getEmployeeSiple = () => {
    return request({
        url: '/sys/user/simple',
        method: 'GET'
    })
}