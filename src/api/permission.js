/***
 * 权限设置请求
 * *******/
import request from '@/utils/request' // 引入axios 请求
/****
 * 获取所有权限列表
 * ******/


export const getPerssionList = params => {
    return request({
        method: 'GET',
        url: '/sys/permission',
        params
    })
}

/****
 * 新增权限
 * ******/
export const addPerssion = data => {
    return request({
        method: 'POST',
        url: '/sys/permission',
        data
    })
}

/****
 * 根据id 删除 用户权限
 * ******/
export const deletePerssionById = id => {
    return request({
        method: 'DELETE',
        url: `/sys/permission/${id}`
    })
}

/****
 * 根据id 更新 权限
 * ******/

export const updatePerssionById = data => {
    return request({
        method: 'PUT',
        url: `/sys/permission/${data.id}`,
        data
    })
}

/****
 * 根据id 更新 权限详情
 * ******/
export const getPerssionDetail = id => {
    return request({
        method: 'GET',
        url: `/sys/permission/${id}`
    })
}