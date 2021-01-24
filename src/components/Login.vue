<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 表单logo图标 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <!-- 表单 -->
      <el-form ref="loginRef" label-width="0px" class="login_input" :model="loginForm" :rules="loginFormRules">
        <!-- 登录名称 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 登录、重置按钮 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resets">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script scoped>
  export default {
    name: 'Login',
    data() {
      return {
        // 给登录名称和登录密码设置默认值
        loginForm: {
          username: '',
          password: '',
        },
        // 登录规则效验  rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 rules 和 prop 搭配使用;
        loginFormRules: {
          // 登录名称效验
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 登录密码效验
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 点击重置按钮清除表单验证
      resets() {
        // console.log(this);
        this.$refs.loginRef.resetFields()    // resetFields 重置字段;  用 $refs.xxx 方法时，需要搭配 上面的 ref='xxx'一起使用
      },
      // 点击登录按钮进行验证
      login() {
        this.$refs.loginRef.validate(async valid => {
          // console.log(valid);    // 接收的是一个布尔值
          if (!valid) return;

          console.log(this.$http);
          // 发生ajax请求
          const res = await this.$http.post('login', this.loginForm)
          console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功');

          // 保存token
          window.sessionStorage.setItem("token",res.data.data.token)
          // 跳转页面
          this.$router.push('/home')
        })
      }

    },
  };
</script>
<style>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
  }

  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    border-radius: 20px;
    background-color: #fff;
  }

  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    width: 120px;
    height: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 -1px 1px 1px rgba(0, 0, 0, .1);
  }

  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login_input {
    position: absolute;
    padding: 20px;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .login-btn {
    display: flex;
    justify-content: flex-end;
  }
</style>