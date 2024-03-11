import { postUrl } from '../index'

//请求地址前缀
const urlPath = "/api/mg/user/";

const user = {
  //列表
  list: (params) => {
    return postUrl(urlPath + "list", params);
  },
}

export default user