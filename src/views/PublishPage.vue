<template>
  <div class='publish-page'>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form ref="articleForm" label-width="120px" :model="articleForm" :rules="articleRules">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <MyChannel v-model="articleForm.channel_id"></MyChannel>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-radio-group @change="changeCoverType()" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div>
            <el-upload
              ref="upload"
              :action="`${$http.defaults.baseURL}v1_0/upload`"
              name="image"
              :headers="{Authorization: `Bearer ${articleForm.token}`}"
              list-type="picture-card"
              :limit="articleForm.cover.type"
              :on-success="uploadSuccess"
              :on-remove="removeFile"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <quill-editor @blur="checkContent()" v-model="articleForm.content" :options="articleForm.editorOption"/>
        </el-form-item>
        <el-form-item label="" v-if="$route.query.id">
          <el-button @click="update(false)" type="primary">修改文章</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item label="" v-else>
          <el-button @click="submit(false)" type="primary">发布文章</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import auth from '@/utils/auth'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'PublishPage',
  components: {
    quillEditor
  },
  data () {
    // 自定义校验规则
    const checkCoverFn = (rule, value, cb) => {
      // 自己对value进行校验
      if (value.type === 1) {
        if (!value.images[0]) {
          return cb(new Error('请选择一张封面图'))
        }
      }
      if (value.type === 3) {
        if (!(value.images[0] && value.images[1] && value.images[2])) {
          return cb(new Error('请选择三张封面图'))
        }
      }
      // 代码走到这，校验成功
      cb()
    }
    return {
      // 表单数据
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        token: auth.getToken(),
        // 富文本配置
        editorOption: {}
      },
      // 校验规则
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 50, message: '文章标题4-50字符', trigger: 'blur' }
        ],
        cover: [
          // 需要自定义
          { validator: checkCoverFn, trigger: 'change' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 封面类型变化重置，清空地址
    changeCoverType () {
      this.articleForm.cover.images = []
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.$refs.articleForm.validateField('cover')
    },
    // 上传图片成功将地址存到数组
    uploadSuccess (res) {
      this.articleForm.cover.images.push(res.data.url)
      this.$refs.articleForm.validateField('cover')
    },
    // 文章内容校验
    checkContent () {
      // 校验内容表单项
      this.$refs.articleForm.validateField('content')
    },
    // 删除文件
    removeFile (file) {
      // 主动：删除images数组中对应的图片
      // file 中保存了之前上传图片响应的信息 response.data.url 图片地址
      // 根据这个图片地址找到images对应的索引，通过splice(索引,1) 删除图片
      const index = this.articleForm.cover.images.findIndex(item => item === file.response.data.url)
      this.articleForm.cover.images.splice(index, 1)
      // 自己再次校验
      this.$refs.articleForm.validateField('cover')
    },
    submit (draft) {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          this.$http.post('/v1_0/mp/articles?draft=' + draft, this.articleForm).then(res => {
            this.$message.success('发布成功')
            this.$router.push('/article')
          }).catch(() => {
            this.$message.error('发布失败')
          })
        }
      })
    },
    getArticle (id) {
      this.$http.get('/v1_0/mp/articles/' + id).then(res => {
        this.articleForm = res.data.data
      })
    },
    update (draft) {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          this.$http.put('/v1_0/mp/articles/' + this.$route.query.id + '?draft=' + draft, this.articleForm).then(res => {
            this.$message.success('修改成功')
            this.$router.push('/article')
          }).catch(() => {
            this.$message.error('修改失败')
          })
        }
      })
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getArticle(this.$route.query.id)
    }
  },
  computed: {
    fileList () {
      return this.articleForm.cover.images.map(item => ({ name: item, url: item }))
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.query.id) {
      this.getArticle(to.query.id)
    } else {
      this.$refs.articleForm.resetFields()
    }
    next()
  }
}
</script>

<style lang="less" scoped>
::v-deep .ql-editor {
  min-height: 300px;
}
</style>
