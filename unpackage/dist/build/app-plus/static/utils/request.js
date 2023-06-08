import encrypt from '../../libs/encrypt.js'

function request(url, data = {}, method = "GET", contentType = 'application/json') {
	return new Promise(function(resolve, reject) {
		let APP_KEY = "ymdj";
		let APP_NOTIC = encrypt.createUUID(32).toLowerCase();
		let APP_TIMESTAMP = Math.round(new Date().getTime() / 1000);
		let APP_SIGN = encrypt.hex_md5(APP_NOTIC, APP_TIMESTAMP);

		let header = {
			"Content-Type": "application/json",
			appKey: APP_KEY,
			appnotic: APP_NOTIC,
			appsign: APP_TIMESTAMP,
			appsign: APP_SIGN,
			systemCode: 'YMDJ_USER',
			apptimestamp: APP_TIMESTAMP,
			ftoken: uni.getStorageSync('ftoken') || '',
			source: plus.os.name === 'Android' ? 'android' : 'ios',
			extrasystemcode: 'YMDJ_USER'
		}
		console.log('url=', url)
		// console.log('data=', data)
		// console.log('header', header)
		uni.request({
			url: url,
			data: data,
			method: method,
			sslVerify: false,
			header: header,
			success: (res) => {
				// console.log('request-res=',res)
				setTimeout(() => {
					uni.hideLoading()
				}, 100)
				if (res.data.statusCode == '60001' || res.data.statusCode == 'unAuth') {
					uni.showToast({
						title: '登录超时!',
						icon: 'error'
					})
					uni.removeStorageSync('ftoken')
					uni.removeStorageSync('phone')
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}, 1000)

					return;
				}else if(res.statusCode!=="ok"&&res.statusCode!=200&&res.statusCode!='success'){
					console.log('error--',res)
					console.log('error--url',url)
					uni.hideLoading()
					plus.nativeUI.closeWaiting()
					uni.showToast({
						title: res.data.statusMessage?res.data.statusMessage:'网络异常，请稍后重试',
						duration: 3000,
						icon: 'none'
					})
					return;
				}
				res.data = !res.data?'':res.data
				resolve(res.data);
			},
			complete: (fin) => {
				// uni.hideLoading()
				// uni.stopPullDownRefresh()
			},
			fail: function(err) {
				console.log('err=',err)
				uni.hideLoading()
				plus.nativeUI.closeWaiting()
				uni.showToast({
					title: '网络异常，请稍后重试',
					duration: 3000,
					icon: 'none'
				})
				reject(err);
			}
		});
	});
}

function upLoad(url, data = {}, contentType = 'application/json') {


}

module.exports = {
	request,
};
