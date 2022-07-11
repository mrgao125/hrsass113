// 负责所有自定义组件 全局注册
import PageTools from './PageTools'
export default {
    // install 方法 参数 传递 vue 实例  相对于引用了vue实例
    install(Vue) {
        Vue.component('PageTools', PageTools)
    }
}
// Vue.use()