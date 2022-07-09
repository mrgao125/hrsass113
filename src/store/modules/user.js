// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
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
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}