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

// 保存个人基本信息
export const saveUserDetailById = data => {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'PUT',
        data
    })
}

// 保存个人信息
export const saveUserInfoPersonal = (id, data) => {
    return request({
        url: `/employees/${id}/personalInfo`,
        method: 'PUT',
        data
    })
}

// 保存岗位信息
export const saveJobInfo = (id, data) => {
    return request({
        method: 'PUT',
        url: `/employees/${id}/jobs`,
        data
    })
}

// 获取员工个人信息
export const getPersonalDetail = id => {
    return request({
        method: 'GET',
        url: `/employees/${id}/personalInfo`
    })
}

// 获取员工岗位信息
export const getJobInfo = id => {
    return request({
        method: 'get',
        url: `/employees/${id}/jobs`
    })
}

/** **
 * 给用户分配角色
 * *****/
export const assignRole = data => {
    return request({
        method: 'put',
        url: '/sys/user/assignRoles',
        data
    })
}