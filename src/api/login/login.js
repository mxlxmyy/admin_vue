import { getUrl, postUrl, loadCsrf } from '../index'
import { failPromise } from '@/libs/error'
import { setCookie } from '@/libs/local.db'

//请求地址前缀
const urlPath = "/api/login/";

const login = {
  //登录
  in: (params) => {
    return postUrl(urlPath + "auth", params);
  },

  //登出
  out: () => {
    return getUrl(urlPath + "out");
  },

  //获取登录用户ID
  userId: () => {
    return getUrl(urlPath + "user");
  },

  //登录并初始化
  init: params => {
    return login.in(params)
    .then(res => {
      if (res.code == 1) {
        //登录成功
        return login.userId()
        .then(res => {
          if (res.code == 1) {
            setCookie('userInfo', res.posts);
          } else {
            return failPromise(res.msg);
          }
        });
      } else {
        return failPromise(res.msg);
      }
    })
  },

  //初始化csrf
  csrf: () => {
    return loadCsrf();
  }
}

export default login