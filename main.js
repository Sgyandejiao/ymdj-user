import App from './App'

// #ifndef VUE3
import Vue from 'vue'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import util from './static/utils/request.js'
import tool from './static/utils/utils.js'
import bluetooth from './static/utils/bluetooth.js'
import apis from './static/config/apis.js'

Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$util = util
Vue.prototype.$tool = tool
Vue.prototype.$bluetooth = bluetooth
Vue.prototype.$apis = apis
import prototypeJs from './static/utils/prototype.js'
// 判断市场常见的几种刘海屏机型
uni.getSystemInfo({
	success: function(res) {
		let modelmes = res.model;
		console.log("手机型号-------", res.model);
		if (modelmes.indexOf('iPhone X') >= 0 || modelmes.indexOf('iPhone XR') >= 0 || modelmes.indexOf(
				'iPhone XS') >= 0 || modelmes.indexOf('iPhone 12') >= 0 || modelmes.indexOf('iPhone 11') >=
			0 || modelmes.indexOf('iPhone11') >= 0 || modelmes.indexOf('iPhone12') >= 0 || modelmes.indexOf(
				'iPhoneXR') >= 0 || modelmes.indexOf('iPhoneX') >= 0) {
			Vue.prototype.$is_bang = true
		} else {
			Vue.prototype.$is_bang = false
		}
	}
});



App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
