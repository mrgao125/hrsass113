// 权限拦截路由跳转  路由守卫
import router from "./router"
import store from '@/store' // store实例
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' //引入进度条样式
// 不需要导出，因为已经在main.js引入了，代码已经执行
// 前置守卫必须执行next   next() 放过   next(false)跳转   next(url)跳转到指定地址
const whiteList = ['/login', '/404'] // 定义一个白名单 不受token控制
router.beforeEach((to, from, next) => {
    nprogress.start() // 开启进度条
    if (store.getters.token) {
        // 如果有token
        if (to.path === '/login') {
            // 如果访问的是 /login 
            next('/') // 跳到主页
        } else {
            next() //放行
        }
    } else {
        // 没有token的情况下
        if (whiteList.indexOf(to.path) >= 0) {
            // 表示要去的地址在白名单
            next()
        } else {
            next('/login')
        }
    }
    nprogress.done() // 关闭进度条
})
router.afterEach(() => {
    nprogress.done() // 关闭进度条
})