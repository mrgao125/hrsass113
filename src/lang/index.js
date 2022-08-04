// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 引入cookie工具
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入中文语言包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入英文语言包
import customZH from './zh' // 自定义中文包
import customEN from './en' // 自定义英文包

Vue.use(VueI18n) // 完成全局注册

// 实例化
export default new VueI18n({
    // i18n 选项 
    // locale 决定了当前的语言类型  切换语言，设置该属性
    locale: Cookie.get('language') || 'zh', // 指的是当前的多语言的类型  随意定义的字符串  中文/英文 zh/en/ ja
    messages: {
        zh: {
            // elementUI 语言包 + 自定义的语言包
            ...elementZH,
            ...customZH
        },
        en: {
            ...elementEN,
            ...customEN
        }
    } // 当前的语言包   对象
})