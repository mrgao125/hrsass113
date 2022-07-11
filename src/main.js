import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'
import component from '@/components' // 注册全局公共组件
import * as directives from '@/directives'
import * as filters from '@/filters' // 引入过滤器
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
Vue.use(ElementUI, { locale })
    // 如果想要中文版 element-ui，按如下方式声明
    // Vue.use(ElementUI)
Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key]) // 设置自定义指令
})

// 注册自定义过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 注册自定义组件
Vue.use(component)
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})