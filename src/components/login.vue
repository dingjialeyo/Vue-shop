<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo区域 -->
      <div class="logo_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单登录区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button :plain="true" type="primary" @click="login"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // 对应的对象
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单方法
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录检验方法 预验证
    login() {
      // validate()可以返回一个promise对象 值为布尔值 判断校验是否正确
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid) 判断的布尔值
        // 如果为false， 则return不发送请求
        if (!valid) return
        // 校验成功则发送ajax请求   this.loginForm是数据绑定的表单值
        // { data : ret } ==》获取过来的promise对象中的data属性赋给ret
        const { data: ret } = await this.$http.post('login', this.loginForm)
        // console.log(ret)
        // 通过弹框组件来提示
        if (ret.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 1.登录成功后获取ret中的token值，保存到客户端的 sessionStorage 中
        //  1.1 项目中的其他接口，都是基于登录成功后才能访问的
        //  1.2 token 只应在当前网站打开时生效，所以才将token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', ret.data.token) // 保存token值
        // 2.然后通过编程式导航跳转到后台主页 路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: pink;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .logo_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ddd;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
