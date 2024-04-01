<template>
  <div class="toolbar">
    <el-dropdown>
      <el-icon style="margin-right: 8px; margin-top: 1px"
        ><setting
      /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span>{{ store.user.name }}</span>
  </div>
</template>

<script setup>
import { Setting, More } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import loginApi from '@/api/login/login'
import { useCounterStore } from '@/stores/counter'
import { rmCookie } from '@/libs/local.db'

const store = useCounterStore();

const router = useRouter();

//退出登录
function loginOut()
{
  loginApi.out()
  .then(res => {
    rmCookie("userInfo")
    store.setUser({});
    //跳转
    router.push({
      name: 'login'
    });
  })
  .catch(err => {
    ElMessage.error(err)
  })
}
</script>

<style scoped>
  .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
  .mobile_menu {
    display: inline-flex;
    font-size: 1.4rem;
    position: absolute;
    left: 0;
    top: 3px;
    padding: 10px;
  }
</style>