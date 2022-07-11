import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeeSiple = () => {
    return request({
        url: '/sys/user/simple',
        method: 'GET'
    })
}

// 获取员工综合列表
export const getEmployeeList = params => {
    return request({
        url: '/sys/user',
        method: 'GET',
        params
    })
}