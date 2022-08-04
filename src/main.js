import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import zhLocale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'
import component from '@/components' // 注册全局公共组件
import * as directives from '@/directives'
import * as filters from '@/filters' // 引入过滤器 * 引入会将 所有函数和函数名放入一个对象 组成key : value形式
import i18n from '@/lang' // 引入多语言实例
import { CheckPermission } from '@/mixin/CheckPermission'
import '@/icons' // icon
import '@/permission' // 权限控制

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { zhLocale })

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
    // element 支持i8n 的处理 
    // 此时 i18n 会根据 当前的locale属性 去寻找对应的显示内存  改变locale的值，语言就会改变
    i18n: (key, value) => i18n.t(key, value) // 调用i18n的 t方法 会去对应的语言包中寻找对应的内容
})
Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key]) // 设置自定义指令
})

// 注册自定义过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 注册自定义组件
Vue.use(component)

// 全局注册混入检查对象  表示所有组件都拥有一个检查的方法
Vue.mixin(CheckPermission)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})