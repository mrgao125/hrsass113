import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from "element-ui"
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
    // 创建实例对象
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 环境变量  /api   /prod-api
    timeout: 10000 // 超时时间
})

// 请求拦截器  处理token
service.interceptors.request.use(config => {
    // config  请求配置信息
    // 注入token
    if (store.getters.token) {
        // 在有token的情况下，才有必要检查时间戳是否超时
        if (isCheckTimeOut()) {
            // 如果为true 过期了 登出操作
            store.dispatch('user/logout')
                // 跳转登录页
            router.push('/login')
            return Promise.reject(new Error('token超时了')) // 阻止promise继续运行
        }
        config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config // config 必须返回
}, error => {
    return Promise.reject(error)
})

// 响应拦截器  处理数据
service.interceptors.response.use(response => {
    // axios 默认加一层data  解构最外层的data
    const { success, message, data } = response.data
        // 根据success的成功与否，决定下面操作
    if (success) {
        return data
    } else {
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    // error 信息里面会有 response信息
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 表示后端告诉 token失效  登出操作
        store.dispatch('user/logout')
        router.push('/login')
    } else {
        Message.error(error.message) // el方法提示错误信息
    }
    return Promise.reject() // 返回执行错误，让当前执行链跳出成功，直接进入catch
})

// 是否超时
// 超时逻辑  当前时间 - 缓存中的时间 是否大于  时间差
function isCheckTimeOut() {
    let currentTime = Date.now() // 当前时间戳
    let timeStamp = getTimeStamp() // 缓存中的时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service