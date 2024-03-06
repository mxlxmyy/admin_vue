import VueCookies from 'vue-cookies'
import { getData, setData } from '@/libs/local.db'

const tokenKey = import.meta.env.VITE_APP_NAME;

//获取浏览器缓存的token
export const getToken = ({
  //是否尝试从localStorage中获取
  localDb = false,
}) => {
  let token = VueCookies.get(tokenKey);
  if (token == '' || token == null || token == 'undefined') {
    if (localDb == true) {
      token = getData(tokenKey);
      if (token == '' || token == null || token == 'undefined') {
      } else {
        return token;
      }
    }
  } else {
    return token;
  }

  return '';
}

//保存用户token
export const setToken = ({
  //用户token
  token = '',
  //是否同时保存到localStorage中
  localDb = false,
}) => {
  if (token == '') {
    throw Error("token不能为空！");
  }
  VueCookies.set(tokenKey, token);
  if (localDb == true) {
    setData(tokenKey, token);
  }
}
