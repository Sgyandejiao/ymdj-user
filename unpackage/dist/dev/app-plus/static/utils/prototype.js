import Vue from 'vue'

// 普通提示
Vue.prototype.$toast = (msg) => {
	plus.nativeUI.toast(msg)
	// uni.showToast({
	// 	title: msg,
	// 	icon: 'none'
	// })
}

//保留小数位
Vue.prototype.$toFixed = (num) => {
	var result = parseFloat(num);
	if (isNaN(result)) {
		return '0.00';
	}
	result = Math.round(num * 100) / 100;
	var s_x = result.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0';
	}
	return s_x;
}

// 获取金额整数/小数位
Vue.prototype.$getBit = (value, bit = 2) => {
	// console.log('开始计算整数小数')
	value = (Number(value).toFixed(2)).toString();
	let integer = value.split('.')[0]
	let decimal = value.split('.')[1]
	return {
		integer,
		decimal
	};
}

// 指定位置插入字符
Vue.prototype.$insertStr = (soure, start, newStr) => {
	return soure.slice(0, start) + newStr + soure.slice(start)
}

// 文字脱敏显示 name:名字、phone:手机号
Vue.prototype.$tuomin = (value, type) => {
	if (type == 'name') {
		if (value.length == 2) {
			//截取name 字符串截取第一个字符，
			return value.substring(0, 1) + '*';
		} else if (value.length == 3) {
			//截取第一个和第三个字符
			return value.substring(0, 1) + '*' + value.substring(2, 3);
		} else if (value.length > 3) {
			//截取第一个和大于第4个字符
			return (
				value.substring(0, 1) + '*' + '*' + value.substring(3, value.length)
			);
		}
	} else if (type == 'phone') {
		// 手机号仅显示前三位及后四位数字，隐藏信息用*代替
		return value.length == 11 ? value.substr(0, 3) + '****' + value.substring(7) : value;
	}
}

// 校验手机号格式
Vue.prototype.$checkPhone = (mobile) => {
	var re = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
	var result = re.test(mobile);
	if (!result) {
		return false; //若手机号码格式不正确则返回false
	}
	return true;
}

// 获取uuid：全局唯一标识符
Vue.prototype.$getUUid = () => {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;

}

Vue.prototype.$getSimOperatorName = () => {
	plus.android.importClass('android.telephony.TelephonyManager')
	let context = plus.android.importClass('android.content.Context');
	let TelephonyManager = plus.android.runtimeMainActivity().getSystemService(context.TELEPHONY_SERVICE);
	let OperatorName = TelephonyManager.getSimOperatorName();
	console.log("运行商名称: ", OperatorName);
	return OperatorName;
}

Vue.prototype.$silentLogin = (phone) => {

}

Vue.prototype.$checkLogin = () =>{
	if (!uni.getStorageSync('ftoken') || !uni.getStorageSync('phone')) {
			uni.navigateTo({
				url: '/pages/login/code'
			})
		return false;
	}else{
		return true;
	}
}


Vue.prototype.$checkWords = (words) =>{
	let strList = ['VIP','会员','Q币','租号','游戏','YOUKU','月','券','视频','充','虚拟','账号'];
	
	let filterList = strList.filter(n=>{
	    return words.toLocaleUpperCase().indexOf(n)>-1
	})
	if(filterList.length>0){
		// 存在敏感词
		console.log('敏感词',words)
		return true
	}else{
		return false
	}
}
