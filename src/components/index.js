// 负责所有自定义组件 全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import VueClipboard from 'vue-clipboard2'
export default {
    // install 方法 参数 传递 vue 实例  相对于引用了vue实例
    install(Vue) {
        Vue.component('PageTools', PageTools) // 自定义样式组件
        Vue.component('UploadExcel', UploadExcel) // 下载表格组件
        Vue.component('ImageUpload', ImageUpload) // 全局注册上传图片组件
        Vue.use(Print) // 全局注册打印组件
        Vue.use(VueClipboard) // 全局注册复制
    }
}
// Vue.use()
// Vue.use和Vue.component 区别，前者可以一次性注册多个组件，后者只能一次注册一个组件