import { getUrl, postUrl } from '../index'

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

  //刷新授权
  reauth: () => {
    return getUrl(urlPath + "reauth");
  }
}

export default login