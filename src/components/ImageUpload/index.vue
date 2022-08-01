<template>
<div>
    <!-- file-list 上传的文件列表，可以绑定到上传组件上，让上传组件显示 -->
    <el-upload 
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove='remove'
      :on-change="changeFile"
      :file-list="fileList"
      :class="{ uploadDisabled : fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
    <!-- action地址是必填参数，但是此处案例使用自定义上传，action给定#地址 -->
        <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 上传进度条 -->
    <el-progress 
        :percentage="percent" 
        style="width: 180px"
        v-if="showPercent"
    ></el-progress>
    <el-dialog 
      title="图片预览"
      :visible.sync="dialogVisible"
    >
    <!-- 此处.sync 修饰符 因为组件内使用，不用传值，就相当于触发close事件 -->
        <img :src="dialogImageUrl" alt="" width="100%">
    </el-dialog>
</div>
</template>

<script>
import COS from 'cos-js-sdk-v5'  // 引入腾讯云 COS 包
// 实例化COS  需要两个参数
const cos = new COS({
    SecretId: 'AKIDteJo7DAwVBgy51kLjvvgEbmmdL8h2B7r', // 身份识别
    SecretKey: 'b4NWUEpDNJ2OYYN1UvCGArNkwwiMDyYw' // 身份id
})
export default {
  data() {
      return {
        fileList:[],
        dialogVisible: false,
        dialogImageUrl: '',
        currentFileUid: null,  // 当前的file 的uid
        percent: 0, // 上传百分比
        showPercent: false
      }
  },
  computed: {
    // 如果计算数组为true 表示不应该显示 加号 +
    fileComputed() {
        return this.fileList.length === 1
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 点击预览事件
    preview(file) {
        this.dialogVisible = true  // 显示弹层
        this.dialogImageUrl = file.url  // 将文件地址 赋值给 弹层地址
    },
    // 点击删除事件
    // file 是要删除的文件，fileList 是删过之后剩下的文件
    remove(file, fileList) {
        // console.log(file)
        // console.log(fileList)
        // console.log(this.fileList)
        this.fileList = this.fileList.filter(item => item.uid !== file.uid)  // 将当前删除的文件排除在外
        // this.fileList = fileList  第二种方法
    },
    // 这个函数不能用push  因为这个钩子会执行两次
    changeFile(file, fileList) {
        // file 是当前的文件
        // fileList 是当前最新的数组
        // console.log(fileList.length)  //会打印执行两次
        this.fileList = fileList.map(item => item)
        // 这里为什么执行不成功  因为这里没有上传  第二次进来 的数据一定是空的
        // 如果完成上传动作，第一次和第二次的上传 数组 长度 应该都为 1
        // 接下来，应该让上传成功。 上传到腾讯云
    },
    beforeUpload(file){
        // 检查文件类型 (some 遍历判断数组中是否存在，返回布尔值)
        const types = [ 'image/jpeg', 'image/gif', 'image/bmp', 'image/png']
        if(!types.some(item => item === file.type)) {
            // 如果不存在
            this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
            return false  // 上传中止
        }
        // 检查文件大小 5M js中显示是单位是 b
        const maxSize = 5 * 1024 * 1024
        if(file.size > maxSize) {
            this.$message.error('图片大小最大不能超过5M')
            return false // 上传中止
        }
        this.currentFileUid = file.uid   // 保存当前上传图片的uid
        this.showPercent = true  // 显示上传进度条
        return true  // 最后通过
    },
    upload(params) {
        // 自定义上传
        // console.log(params.file)
        // 腾讯云上传操作
        if(params.file) {
            // 如果文件存在，进行上传操作  两参数： 上传参数，函数参数
            cos.putObject({
                // 上传到腾讯云 =》哪个存储桶  哪个地域的存储桶  文件 格式 名称
                Bucket: 'wodetupian-108-1312975465', // 存储桶名称
                Region: 'ap-beijing', // 地域
                Key: params.file.name, // 文件名称
                Body: params.file, // 要上传的文件对象
                StorageClass: 'STANDARD', // 上传模式类型，默认标准模式
                onProgress: (params) => {
                    // 上传进度条 params 执行多次，可以获取多次
                    this.percent = params.percent * 100
                }
            }, (err, data) => {
                // data 返回数据后 如何处理
                console.log(err || data)  // 返回换上
                if(!err && data.statusCode === 200) {
                    // 此时文件上传成功  获取 成功的 返回地址
                    // 将fileList 中的数据 的url 变成 上传成功的地址
                    // 目前是一张图片 但后面可能改变  需要指定当前上传成功的是哪一张
                    this.fileList = this.fileList.map(item => {
                        // 找谁的uid等于刚上传的uid
                        if(item.uid === this.currentFileUid) {
                            return { url: 'http://' + data.Location, upload: true}
                            // upload 为true 表示图片上传完毕，为后期使用做标记
                            // 点击保存的时候，图片有大小，上传速度有快慢 要根据有没有uplaod 决定是否保存  图片上传完成前 不能保存
                        }
                        return item
                    })
                    // 将上传的地址回写到了fileList   upload组件根据 fileList变化 更新图像
                    // 上传成功后关闭进度条
                    setTimeout(() => {
                        this.showPercent = false // 关闭进度条
                        this.percent = 0 // 重置百分比
                    }, 2000)
                }
            })
        }
    }
  }
}
</script>

<style lang="scss">
    .uploadDisabled  { 
        .el-upload--picture-card {
            display: none  
    }

    }
</style>
