/**
 * 处理请求
 */

import axios from "axios"
import { getToken, setToken } from '@/api/auth'
import { useRouter } from "vue-router";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
//设置post请求是的header信息
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
//设置put请求是的header信息
axios.defaults.headers.put["X-HTTP-Method-Override"] = "PUT";
//异步请求
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";

//跳转登录页
function goLogin() {
  const router = useRouter();
  router.push({
    name: import.meta.env.VITE_LOGIN_PAGE,
  });
}

//请求拦截处理
axios.interceptors.request.use(
  config => {
    // console.log("config: ", config);
    const authToken = getToken({});
    if (authToken != '') {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers["Authorization"] = authToken;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//重试请求队列
const requestWait = [];
//当前是否正在刷新缓存
const isRefreshing = false;
//响应拦截处理
axios.interceptors.response.use(
  response => {
    // console.log("response: ", response);
    if (response.data.code == 302) {
      // 302token完全过期，需要重新登录
      goLogin();
    } else if (response.data.code == 301) {
      //token过期，但可刷新
      const authToken = getToken({});
      if (authToken == '') {
        goLogin();
      } else {
        const config = response.config;
        if (!isRefreshing) {
          isRefreshing = true
          return refreshToken()
          .then(( res ) => {
            setToken({token: res.posts.token});

            // 已经刷新了token，将所有队列中的请求进行重试
            config.headers[ 'Authorization' ] = res.posts.token;
            requestWait.reverse();
            requestWait.forEach( cb => cb( res.posts.token ) );
            // 重试完了别忘了清空这个队列
            requestWait = [];

            return axios( config );
          })
          .catch( res => {
            // console.error( 'refreshtoken error =>', res );
            goLogin();
          })
          .finally(() => {
            isRefreshing = false
          });
        } else {
          // 正在刷新token，返回一个未执行resolve的promise
          return new Promise( ( resolve ) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requestWait.push( ( token ) => {
              config.headers[ 'Authorization' ] = token;
              resolve(axios(config))
            } )
          } )
        }
      }
    } else {
      if (response.data.token) {
        //当响应中带有自动刷新的token时，更新
        setToken({token: response.data.token});
      }
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @returns 
 */
export const getUrl = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: {
          t: Date.parse(new Date()),
          ...params
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

/**
 * post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const postUrl = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

/**
 * put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const putUrl = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};

/**
 * delete请求
 * @param {String} url [请求的url地址]
 * delete用于删除，参数一般带在url
 */
export const deleteUrl = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: {
          t: Date.parse(new Date()),
          ...params
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.message);
      });
  });
};
