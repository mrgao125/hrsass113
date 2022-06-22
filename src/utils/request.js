import axios from axios

// 创建实例对象
const service = axios.create()

// 请求拦截器  处理token
service.interceptors.request.use()

// 响应拦截器  处理数据
service.interceptors.response.use()

export default service