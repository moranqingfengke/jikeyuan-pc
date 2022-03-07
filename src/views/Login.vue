<template>
  <div class="container">
    <el-card>
      <img src="@/assets/个人logo.jpg" alt="" class="logo">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意「用户协议」和「隐私条款」</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login()">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import auth from '@/utils/auth.js'

export default {
  name: 'Login',
  data () {
    // 手机号校验
    const checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不对'))
      }
    }
    return {
      form: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async vaild => {
        if (vaild) {
          try {
            // 请求
            const res = await this.$http.post('/v1_0/authorizations', this.form)
            // 成功
            // localStorage.setItem('geek-client-pc-store', res.data.data.token)
            auth.setToken(res.data.data.token)
            this.$router.push('/')
          } catch (e) {
            // 失败
            this.$message.error(e.response.data.message || '登录失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: url("../assets/bgi.png") no-repeat;
  background-size: 100% 100%;
  .el-card {
    width: 440px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .logo{
      display: block;
      margin: 0 auto 20px;
      width: 25%;
      border-radius: 50%;
    };
    .el-button {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
