// 专门处理权限路由的模块
import { constantRoutes, asyncRouters } from '@/router/index'
const state = {
    // 一开始，所有用户都拥有静态路由权限
    routes: constantRoutes // 路由表，表示当前用户所拥有的所有路由的数据
}
const mutations = {
    // 定义修改routes 的方法
    // payload 认为是我们登录成功，需要添加的新路由
    setRoutes(state, newRoutes) {
        // state.routes = [...constantRoutes, ...newRoutes] // 这种写法不正确 会产生业务逻辑错误
        state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上添加新的路由
    }
}
const actions = {
    // filter 筛选 权限路由
    // 第二个参数为，当前用户所拥有的菜单权限
    // menus [] 对应用户数据中的 menus
    // asyncRouters 是所有的动态路由 [ {},{}] 对象数组结构
    filterRoutes(context, menus) {
        // 筛选出动态路由中和menus 中可以对应的
        const activeRoutes = []
        menus.forEach(item => {
            // item 就是标识
            const newArr = asyncRouters.filter(route => route.name === item) // 得到有可能是空数组，有可能有值
            activeRoutes.push(...newArr) // 数组添加数组，需要先解构   此数据，是当前用户所拥有的动态路由的值
        })
        context.commit('setRoutes', activeRoutes) // 将动态路由提交给mutations
        return activeRoutes // 这里为什么还要return  state 数据是用来显示左侧菜单用的 return 是给路由addRoutes用的
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}