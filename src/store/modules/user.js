import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
    token: getToken() || {}, // 设置token为共享状态  初始化vuex时候，先从缓存中获取token
    userInfo: {} // 存储用户信息
}
const mutations = {
    setToken(state, token) {
        state.token = token // 后面的token是mutations 的载荷   将数据设置给vuex   
        setToken(token) // 同步给缓存
    },
    removeToken(state) {
        state.token = null // 将vuex数据清空
        removeToken() // 同步到缓存
    },
    // 设置用户信息
    setUserInfo(state, result) {
        // 更新对象
        state.userInfo = result // 这样更新，是响应式

        // state.userInfo = {...result}  //浅拷贝，也是响应式
    },
    // 删除用户信息 ----退出登录操作
    removeInfo(state) {
        // 将userInfo 设为空对象
        state.userInfo = {}
    }
}
const actions = {
    async login(context, data) {
        // 调用api接口
        const result = await login(data)

        // 如果result.success为true,表示登录成功  数据在响应拦截器中已经处理过
        context.commit('setToken', result)

        // 拿到token说明登录成功
        setTimeStamp() //设置当前时间戳

    },
    async getUserInfo(context) {
        const result = await getUserInfo() // 获取用户信息
        const baseInfo = await getUserDetailById(result.userId) // 获取用户详情 用户的详情数据
        const baseResult = {...result, ...baseInfo } // 合并两项数据
        context.commit('setUserInfo', baseResult) // 提交到mutations
        return baseResult // 这里为什么需要return 这是后期做权限的时候 留下的伏笔
    },
    // 登出操作
    logout(context) {
        // 删除tokn  也删除了缓存中的
        context.commit('removeToken')

        // 删除用户资料
        context.commit('removeInfo')

        // 重置路由  否则上一个用户的权限，下一个用户就会拥有
        resetRouter()

        /*****
         * 设置权限模块下的路由为初始状态 将permission 下的 routes 设为空，回到初始路由状态
         * **/
        // vuex 子模块 之间action 如何调用  都没加 namespaced 可以随意调用，所有的actions 和mutations 都是全局的
        // 加了命名空间的 怎么调用另一个 命名空间的子模块
        // 加了命名空间的context 指的不是全局的，指的是模块下的， 加了第三个参数，
        // mutations 参数 名称 载荷payload 第三个参数对象 {}  {root: true} 标识可以调用根级的 mutations 和actions
        context.commit('permission/setRoutes', [], { root: true })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}