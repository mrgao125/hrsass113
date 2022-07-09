import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

// register globally
Vue.component('svg-icon', SvgIcon) // 创建svg-icon组件

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// 将所有svg目录下，带.svg后缀的文件，引入项目中，在  全局注册的组件 svg-icon 中使用