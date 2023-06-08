<template>
	<view class="content dis cl al_c">
		<u-navbar title="一秒到家" leftText="返回" :autoBack="true" :placeholder="true">
		</u-navbar>
		<!-- <view style="width: 100vw;height: 100vh;margin-top:50rpx;">
			<iframe :src="webUrl" frameborder="0" width="100%" height="120%" ></iframe>
		</view> -->

		<!-- <web-view :src="webUrl" style="height: 80vh;"></web-view> -->
	</view>
	</view>
</template>

<script>
	let nw = null
	let ws = null
	let width = 0
	let height = 0
	export default {
		data() {
			return {
				webUrl: '',
				webTitle: '',
			};
		},
		onShow() {
			// uni.hideTabBar()
			if (nw) {
				console.log('存在网页')
				// plus.webview.show(nw)
				// plus.webview.prefetchURL(this.webUrl)
				// this.createView()
			}

		},
		onLoad() {


		},
		onReady() {

			console.log('onload')
			uni.getSystemInfo({
				//成功获取的回调函数，返回值为系统信息
				success: (sysinfo) => {
					console.log('sysinfo=', sysinfo)
					width = sysinfo.windowWidth;
					height = sysinfo.windowHeight; //自行修改，自己需要的高度 此处如底部有其他内容，可以直接---(-50)这种
				},
				complete: () => {}
			});
			if (uni.getStorageSync('userId')) {
				let url = 'https://gateway.xiaocongkeji.cn/xc/user/index?id=73f14bd639ce67703ffbe83053336ed3&uid=ymdj'
				url = url + uni.getStorageSync('userId') + '&scene=home'
				console.log('url=', url)
				this.webUrl = url
				this.controlUrl()
			}
		},
		mounted() {

		},
		onHide() {
			plus.webview.hide(nw);
			// nw.close()

		},
		onUnload() {
			plus.webview.hide(nw);
			// nw.close()
		},
		onBackPress(options) {
			console.log('options', options)
			if (options.from === "backbutton") {
				return true
			} else {
				return false
			}
			// plus.webview.close('test');
		},
		methods: {
			controlUrl() {
				// #ifdef APP-PLUS
				plus.webview.prefetchURL(this.webUrl)
				this.createView()
				// #endif
			},
			createView() {
				// #ifdef APP-PLUS
				const webUrl = this.webUrl
				console.log('width=', width)
				console.log('height=', height)
				console.log('webUrl=', webUrl)
				plus.nativeUI.showWaiting('正在加载网页..')
				// 打开新窗口
				if (plus.os.name == 'iOS') {
					nw = plus.webview.open(webUrl, 'test', {
						width: width,
						height: height - 100,
						top: '85px',
						bottom: '-200px',
						zindex: 1
					})
				} else {
					nw = plus.webview.create(webUrl, 'test', {
						width: width,
						height: height - 100,
						top: '85px',
						bottom: '-200px',
						zindex: 1
					})
					setTimeout(() => {
						nw.show()
					}, 200)
				}

				nw.addEventListener('loaded', (e) => {
					plus.nativeUI.closeWaiting()
					console.log('加载完成', e)
					// this.loaded()
				}, false);
				ws = plus.webview.currentWebview();

				// -------------------------------------------
				//监听窗口标题更新事件
				nw.addEventListener('titleUpdate', (e) => {
					console.log('Update title: ' + e.title);
					this.webTitle = e.title
					if (e.title != '首页' && e.title != '购物车' && e.title.length > 0 && e.title.length <= 6) {
						// nw.setStyle({
						// 	height: height - 80,
						// 	scalable: false
						// })
						let currentUrl = nw.getURL()
						console.log('currentUrl', currentUrl)

					}
				}, false);
				plus.key.addEventListener('backbutton', () => {
					console.log('回退页面')
					nw.back()

				});
				nw.overrideUrlLoading()
				// plus.key.addEventListener('backbutton', function() { //监听返回事件
				// 	console.log('返回事件')
				// 	nw.canBack(function(e) {

				// 		if (e.canBack) {

				// 			nw.back(); //返回上一页

				// 		} else {

				// 			nw.close(); //关闭应用

				// 		}

				// 	})

				// });

				// #endif 

			},
			loaded() {
				// #ifdef APP-PLUS

				if (uni.getStorageSync('boxInfo').deviceCode == '') {
					plus.nativeUI.confirm('您还未绑定设备，请先绑定', (e) => {
						console.log(e)
						// uni.navigateTo({
						// 	url:'/pages/boxManage/boxManage'
						// })

						uni.switchTab({
							url: '/pages/home/index'
						})
						uni.showTabBar()
					}, {
						"title": "提示",
						"buttons": ["确定"]
					})
				}

				// if (uni.getSystemInfoSync().platform == 'ios') {

				// // 	const currentWebview = this.$mp.page.$getAppWebview();

				// // 	var wv = currentWebview.children()[0];

				// 	//拦截支付宝点击支付的按钮跳转，并修改里面的 fromAppUrlScheme 值



				// }
				nw.overrideUrlLoading({
					mode: 'reject',
					match: '.*alipay\:\/\/.*'
				}, (e) => {

					console.log('被拦截地址', e.url);
					let newUrl = e.url.replace(/alipays/, 'www.ymdj.com://')

					setTimeout(() => {

						console.log('替换地址', newUrl);

						plus.runtime.openURL(newUrl, function(res) {

							console.log('跳转支付宝成功:' + res);

						});

					}, 500);

				});
				nw.addEventListener('loaded', () => {
					if (nw.getURL().indexOf('https://wx.tenpay.com') != -1 && nw.getURL().indexOf('ymdj.com') == -
						1) {
						console.log('currentUrl=', nw.getURL())

						let redirect = nw.getURL().replace(/redirect_url=.*/, 'redirect_url=www.ymdj.com://')
						console.log('redirect=', redirect)

						nw.loadURL(redirect)
					}
				})
				// nw.overrideUrlLoading({
				// 	mode: 'reject',
				// 	match: '.*weixin.*'
				// }, (e) => {
				// 	// this.$toast(JSON.stringify(e.url))
				// 	console.log('被拦截地址', e.url);
				// 	// let url = unescape(e.url)
				// 	// let newUrl = e.url.replace(/redirect_url=.*/, 'redirect_url=www.ymdj.com%3A%2F%2F')
				// 	let newUrl = e.url
				// 	// newUrl = escape(newUrl)
				// 	setTimeout(() => {

				// 		console.log('替换地址', newUrl);

				// 		plus.runtime.openURL(newUrl, {Referer:'http://m.weibo.cn/'}, function(res) {

				// 			console.log('跳转支付宝成功:' + res);

				// 		});

				// 	}, 100);

				// });

				// #endif
			},
			leftBack() {
				// if (this.webTitle != '首页') {
				// 	nw.back()
				// 	return;
				// }
				nw.close()
				if (uni.getStorageSync('lastPage') == 0) {
					uni.switchTab({
						url: '/pages/home/index'
					})
				} else if (uni.getStorageSync('lastPage') == 2) {
					uni.switchTab({
						url: '/pages/shopping/index'
					})
				} else {
					uni.switchTab({
						url: '/pages/my/my'
					})
				}
				uni.showTabBar()
			},
		}

	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #fff;
		padding-bottom: 100rpx;
	}
</style>