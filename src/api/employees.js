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

// 删除员工  接口文档没有，但是实际可以使用
export const deleteEmployee = id => {
    return request({
        url: `/sys/user/${id}`,
        method: 'DELETE'
    })
}

// 新增员工功能
export const addEmployee = data => {
    return request({
        url: '/sys/user',
        method: 'POST',
        data
    })
}

// 批量导入员工信息 此处data要求是数值类型
export const importEmployees = data => {
    return request({
        url: '/sys/user/batch',
        method: 'POST',
        data
    })
}