import Cookies from "js-cookie";
import { getData, setData, setCookie, getCookie } from '@/libs/local.db'

const tokenKey = import.meta.env.VITE_TOKEN_KEY;
const xsrfTokenKey = import.meta.env.VITE_XSRF_TOKEN_KEY;

//获取浏览器缓存的token
export const getToken = ({
  //是否尝试从localStorage中获取
  localDb = false,
}) => {
  let token = getCookie(tokenKey);
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
    ElMessage.error("token不能为空！");
    return false;
  }
  setCookie(tokenKey, token);
  if (localDb == true) {
    setData(tokenKey, token);
  }
  return true;
}

//获取浏览器缓存的XSRF-TOKEN
export const getXsrfToken = () => {
  let token = Cookies.get(xsrfTokenKey);
  if (token == '' || token == null || token == 'undefined') {
    return '';
  } else {
    return token;
  }
}
