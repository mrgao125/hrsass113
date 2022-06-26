import axios from 'axios'
import { Message } from "element-ui"
// 创建实例对象
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 环境变量  /api   /prod-api
    timeout: 5000 // 超时时间
})

// 请求拦截器  处理token
service.interceptors.request.use()

// 响应拦截器  处理数据
service.interceptors.response.use(response => {
    // axios 默认加一层data
    const { success, message, data } = response.data
        // 根据success的成功与否，决定下面操作
    if (success) {
        return data
    } else {
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    Message.error(error.message) // el方法提示错误信息
    return Promise.reject() // 返回执行错误，让当前执行链跳出成功，直接进入catch
})

export default service