/**
 * 加密相关工具类
 */
import CryptoJS from './tripledes'
import apis from '@/static/config/apis.js'
// let app = getApp()

/** 
 *des加密返回数据
 *ciphertext 需加密的内容
 *key 加密key fssh1207
 **/
const encryptByDES = (ciphertext, key) => {
	var keyHex = CryptoJS.enc.Utf8.parse(key);
	var ivHex = CryptoJS.enc.Utf8.parse(key);
	var encrypted = CryptoJS.DES.encrypt(ciphertext, keyHex, {
		iv: ivHex,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.ciphertext.toString().toUpperCase();
}
const formatTime = (format) => {
	var nowDate = new Date();

	var year = nowDate.getFullYear();

	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)

		:
		nowDate.getMonth() + 1;

	var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate

		.getDate();

	var dateStr = JSON.stringify(month) + day
	return dateStr;
};
/** 
 *des解密返回数据
 *ciphertext 需解密的内容
 *key 解密key fssh1207
 **/
const decryptByDES = (ciphertext, key) => {
	// console.log('params',ciphertext,'--------',key)
	var keyHex = CryptoJS.enc.Utf8.parse(key);
	var ivHex = CryptoJS.enc.Utf8.parse(key);
	// direct decrypt ciphertext
	var decrypted = CryptoJS.DES.decrypt({
		ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
	}, keyHex, {
		iv: ivHex,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	// console.log('----------A',decrypted)
	// console.log('----------B',CryptoJS.enc.Utf8)
	// console.log('----------A',typeof(CryptoJS.enc.Utf8))
	return decrypted.toString(CryptoJS.enc.Utf8);
}

// md5 加密
const hex_md5 = (str, times) => {
	var that = this

	let appKey = "ymdj";
	let appSecret = apis.appSecret
	// console.log('appSecret',appSecret)

	var utilMd5 = require('./md5.js')
	var tempStr = appKey + '@' + appSecret + '@' + str + '@' + times
	// console.log("md5入参",tempStr)
	let resValue = utilMd5.hex_md5(tempStr).toUpperCase()

	// console.log('md5出参 APP_SIGN:',resValue)
	return resValue
}

// 生成 uuid
const createUUID = (lenParam, radixParam) => {
	var len = lenParam || 16;
	var radix = radixParam || 16;
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [],
		i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		var r;
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
}

// 获取时间戳
const timeStamp = (timestamp) => {
	// var timestamp = Date.parse(new Date());
	return timestamp / 1000;
}

export default {
	encryptByDES: encryptByDES,
	decryptByDES: decryptByDES,
	hex_md5: hex_md5,
	createUUID: createUUID,
	timeStamp: timeStamp,
	formatTime: formatTime
}
