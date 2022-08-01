import store from '@/store'
export const CheckPermission = {
    // 混入一个方法 是
    methods: {
        // 检查权限  要么有 要么没有
        checkPermission(key) {
            // 去用户的信息中找 point 中 有没有 key 如果有key 则有权限，如果没有则没有权限
            // store.state.user.userInfo.roles.points  // vuex 中获取数据
            const { userInfo } = store.state.user
            if (userInfo.roles && userInfo.roles.points) {
                return userInfo.roles.points.some(item => item === key)
            }
            return false
        }
    }
}