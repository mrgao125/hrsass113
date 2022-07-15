import request from '@/utils/request'

// 获取组织架构数据
export const getDepartments = () => {
    return request({
        url: '/company/department',
        method: 'GET'
    })
}

/* 删除部门功能 */
export const deleteDepartment = id => {
    return request({
        url: `/company/department/${id}`,
        method: 'DELETE'
    })
}

// 新增部门功能
export const addDepartment = data => {
    return request({
        method: 'POST',
        url: '/company/department',
        data
    })
}

// 获取部门详情
export const getDepartmentsDetail = id => {
    return request({
        method: 'GET',
        url: `/company/department/${id}`
    })
}

// 保存编辑数据
export const updateDepartments = data => {
    return request({
        url: `/company/department/${data.id}`,
        method: 'PUT',
        data
    })
}