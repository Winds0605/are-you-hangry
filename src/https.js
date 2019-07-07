import axios from 'axios';
import router from './router/index'


// 请求拦截 
axios.interceptors.request.use(config => {
  if (sessionStorage.ayhToken) {
    //设置统一的request header
    config.headers.Authorization = sessionStorage.ayhToken
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
  return response
}, error => {
  //获取错误状态码
  // const { code } = error.response.data
  // if (code == 2001) {
  //   Message.error('token值无效，请重新登录')
  //   // 清除token
  //   sessionStorage.removeItem('ayhToken')
  //   sessionStorage.removeItem('state')
  //   // 页面跳转
  //   router.push('/login')
  // }

  return Promise.reject(error)
})

export default axios; 