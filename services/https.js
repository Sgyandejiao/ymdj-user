import Vue from 'vue'
// import axios from 'axios'
import encrypt from '@/libs/encrypt.js'
let baseURL = 'https://gateway-test.fanssh.com'
const instance = axios.create({
    headers: {
        "Content-Type": "application/json"
    },
    baseURL: baseURL,
    timeout: 0,
    // withCredentials: true //表示跨域请求时是否需要使用凭证
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
    let APP_KEY = "fanslife";
    let APP_NOTIC = encrypt.createUUID(32).toLowerCase();
    let APP_TIMESTAMP = Math.round(new Date().getTime() / 1000);
    let APP_SIGN = encrypt.hex_md5(APP_NOTIC, APP_TIMESTAMP);

    config.headers.appKey = APP_KEY;
    config.headers.appNotic = APP_NOTIC;
    config.headers.appSign = APP_SIGN;
    config.headers.appTimestamp = APP_TIMESTAMP;
    config.headers.systemCode = "WUYE_USER";
	
    let tokenDefault = process.env.NODE_ENV == 'dev' ? '8728e19d558c489488d1ccaee9526989' : '1a0a89a9144c4573aa6f45995a76d17c'
    config.headers["token"] =  '';

    // store.commit('showLoading')
    return config;
},
    error => {
        store.commit('hideLoading')
        // 请求错误时做些事
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        // store.commit('hideLoading')
        // 对响应数据做些事
        if (response.status === 200) {
            // console.log(response)
            if (response.data.Status) {
                // 在请求成功后可以对返回的数据进行处理，再返回到前台
            } else {
                // console.log('返回到登录...')
            }
        }
        return response.data;
    },
    error => {
        // store.commit('hideLoading')
          return error;
    }
);

export default instance;