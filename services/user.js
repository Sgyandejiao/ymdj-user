// user.js文件
import Vue from 'vue';

// 获取登陆验证码
export const userRegister = (params) => {
	let url = '/cms-service/propert-wechat/bindingFsshCustomer'
    return Vue.prototype.$axios.post(
		url,
        params
    )
}