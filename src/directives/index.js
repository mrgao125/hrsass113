// 负责管理所有的自定义指令
export const imagerror = {
    // 指令对象 会在当前的dom元素插入到节点之后执行
    inserted(dom, options) {
        // options 是指令中 变量的解释 ，其中有一个属性 value
        // dom表示当前指令作用的dom对象
        // dom 此时就认为是图片
        // 当图片有地址，但是未触发成功的时候 会触发一个图片事件，=> onerror
        dom.src = dom.src || options.value // 有值则赋值， 没有值，给默认值
        dom.onerror = function() {
            // 当图片出现异常的时候，会把指令配置的默认图片设置为该图片的内容
            dom.src = options.value // 这里图片不能写死
        }
    },
    // 该函数和inserted 一样也是一个钩子函数
    componentUpdated(dom, options) {
        // 该钩子会在当前作用的组件，数据更新完毕之后调用
        // inserted只会执行一次
        // 组件初始化后，就不会再次进入inserted  函数
        dom.src = dom.src || options.value
    }

}