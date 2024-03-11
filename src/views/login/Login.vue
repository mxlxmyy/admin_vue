<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">{{ title }}</el-header>
      <el-main>
        <el-form :model="form" label-width="auto" class="form">
          <el-form-item label="账号：">
            <el-input v-model="form.account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item class="button_box">
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import loginApi from '@/api/login/login'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const title = import.meta.env.VITE_APP_NAME;

const router = useRouter();

const form = ref({
  account: '',
  password: '',
  code: '',
})

//初始化csrf
loginApi.csrf().catch(err => {
  ElMessage.error('初始化错误！')
});

//提交登录
function onSubmit()
{
  loginApi.init(form.value)
  .then(() => {
    //跳转
    router.replace('/');
  })
  .catch(err => {
    ElMessage.error(err)
  })
}

</script>

<style scoped>
@import '@/assets/login/login.css';
</style>