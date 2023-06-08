<template>
	<view>

		<uni-popup ref="popup" type="center" :mask-click="false">
			<view class="dis cl al_c">
				<view class="pop_v dis cl al_c">
					<view class="title">识别到以下链接</view>
					<view class="content">{{content}}</view>
					<view class="subtitle">选择搜索平台</view>
					<view class="bottom dis al_c">
						<view class="itm dis cl al_c" @click="changeLink(0)">
							<image src="/static//icon/home/nav5.png" mode="widthFix"></image>
							<view>淘宝</view>
						</view>
						<view class="itm dis cl al_c" @click="changeLink(1)">
							<image src="/static//icon/home/nav6.png" mode="widthFix"></image>
							<view>京东</view>
						</view>
						<view class="itm dis cl al_c" @click="changeLink(2)">
							<image src="/static//icon/home/nav7.png" mode="widthFix"></image>
							<view>拼多多</view>
						</view>
					</view>
				</view>
				<image class="close_img" src="/static/icon/close.png" mode="widthFix" @click="navBack"></image>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const jdkpl = uni.requireNativePlugin("FFX-Kpl")
	export default {
		data() {
			return {
				show: false,
				content: ''
			};
		},
		onLoad() {
			if (uni.getStorageSync('copyData')) {
				this.content = uni.getStorageSync('copyData')
				// uni.setClipboardData({
				// 	data:'',
				// 	success() {
				// 		uni.hideToast()
				// 	}
				// })
			}
		},
		mounted() {
			Alibcsdk.init(result => {
				console.log('百川初始化', result)
			});
			jdkpl.initSdk((e) => {
				console.log('jdkplInit', e);
				// e=> {"code":0/1,"message":"初始化失败/成功"}
				uni.setStorageSync('jdkplInit', e)
			});
			this.$refs.popup.open()
		},
		onHide() {
			uni.navigateBack()
		},
		methods: {
			navBack() {
				this.$refs.popup.close()
				uni.navigateBack()
			},
			comfirmChange() {
				// 转链
				let data = {
					itemFrom: 2,
					para: this.content
				}
				this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
					console.log('pdd转链', r)
					plus.nativeUI.closeWaiting()
					if (r.status) {
						// uni.setStorageSync('changeLink', r.data)
						// uni.redirectTo({
						// 	url: '/pages/goods/changeLink?index=' + 2
						// })
						this.navToGoods(2, r)
					} else {
						this.$toast(r.statusMessage)
					}
					this.clearClipboard()
				})
			},
			changeLink(index) {
				plus.nativeUI.showWaiting()
				if (index == 2) { // 拼多多判断授权
					if (!uni.getStorageSync('pddPromstatus')) {
						this.$util.request(this.$apis.queryPddMemberAuthority).then(r => {
							console.log('查询拼多多授权', r)
							if (r.resultValue != 0) {
								this.comfirmChange(index)
								return;
							}
							this.$util.request(this.$apis.pddAuthorize).then(r => {
								console.log('生成拼多多授权', r)
								plus.nativeUI.closeWaiting()
								if (r.status) {
									uni.setStorageSync('pddUrl', r.data.schemaUrl)
									if (plus.runtime.isApplicationExist({
											pname: 'com.xunmeng.pinduoduo',
											action: 'pinduoduo://'
										})) {
										// 应用已安装，打开相关转链页面
										plus.runtime.openURL(r.data.schemaUrl)
									} else {
										//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
										plus.runtime.openURL(r.data.url)
										setTimeout(rr => {
											uni.navigateTo({
												url: '/pages/home/web'
											})
										}, 100)
									}


									setTimeout(rr => {
										this.getInfo()
									}, 1000)
								}
							})
						})
					} else {
						this.comfirmChange(index)
					}
					return;
				} else if (index == 1) {
					let data = {
						itemFrom: index,
						para: this.content
					}
					this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
						console.log('jd链接转链', r)
						plus.nativeUI.closeWaiting()
						if (r.status) {
							// uni.setStorageSync('changeLink', r.data)
							// uni.redirectTo({
							// 	url: '/pages/goods/changeLink?index=' + index
							// })
							this.navToGoods(index, r)
						} else {

							this.$toast(r.statusMessage)
						}
						this.clearClipboard()
					})

					return;
				} else if (index == 0) {
					if (!uni.getStorageSync('taobaoRelationId')) { // 淘宝判断授权
					plus.nativeUI.closeWaiting()
						Alibcsdk.login(
							result => {
								console.log(result)
								if (result.status) {
									this.$util.request(this.$apis.taobaoAuthorize).then(r => {
										console.log('tb授权接口', r)
										Alibcsdk.getpublisher({
											url: r.resultValue,
										}, result => {
											console.log('getpublisher', result)
											setTimeout(res => {
												this.getInfo()
											}, 1000)
										});

									})

								}

								// this.showMsg(JSON.stringify(result))
							}
						)
					} else {
						// 转链
						let data = {
							itemFrom: index,
							para: this.content
						}
						this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
							console.log('tb转链', r)
							plus.nativeUI.closeWaiting()
							if (r.status) {
								this.navToGoods(index, r)
							} else {
								this.$toast(r.statusMessage)
							}
							this.clearClipboard()
						})
					}
				}
			},
			navToGoods(index, r) {
				if (index == 0) {
					Alibcsdk.openurl({
						url: r.data.schemaUrl,
						nativeFailedMode: 'download'
					}, result => {
						console.log('plug.openurl', result)
					});
				} else if (index == 1) {
					jdkpl.openUrl({
						url: r.data.schemaUrl
					}, (e) => {
						console.log(e);
						// e=> {"code":0/1,"message":"打开失败/成功"}
					});
				} else {
					if (plus.runtime.isApplicationExist({
							pname: 'com.xunmeng.pinduoduo',
							action: 'pinduoduo://'
						})) {
						// 应用已安装，打开相关转链页面
						plus.runtime.openURL(r.data.schemaUrl)
					} else {
						//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
						plus.runtime.openURL(r.data.shortUrl)
					}
				}
			},
			// 清除剪切板
			clearClipboard() {
				uni.setClipboardData({
					data: '',
					showToast: false,
					success: () => {
						setTimeout(() => {
							plus.nativeUI.closeWaiting()
							uni.hideToast()
						}, 1000)
					}
				})
			},
			getInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					console.log('用户信息', res)
					if (res.status) {
						uni.setStorageSync('userId', res.data.userId)
						uni.setStorageSync('taobaoRelationId', res.data.taobaoRelationId)
						uni.setStorageSync('pddPromstatus', res.data.pddPromstatus)

					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}

	.pop_v {
		width: 640rpx;
		height: 676rpx;
		background-color: #fff;
		border-radius: 32rpx;

		.title {
			font-size: 32rpx;
			color: #000000;
			width: 100%;
			text-align: center;
			margin-top: 66rpx;
		}

		.content {
			width: 546rpx;
			height: 254rpx;
			background: #F8F8F8;
			border-radius: 8rpx;
			padding: 22rpx 17rpx;
			font-size: 20rpx;
			color: #666666;
			margin-top: 31rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box; // 作为弹性伸缩盒子模型显示。
			-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
			-webkit-line-clamp: 6; // 显示的行
		}

		.subtitle {
			width: 100%;
			text-align: center;
			font-size: 28rpx;
			color: #000000;
			margin-top: 22rpx;
		}

		.bottom {
			width: 100%;
			justify-content: center;

			.itm {
				width: 80rpx;
				margin: 42rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				view {
					font-size: 24rpx;
					color: #0C0C0C;
					margin-top: 6rpx;
				}
			}
		}
	}

	.close_img {
		width: 100rpx;
		height: 100rpx;
		margin-top: 49rpx;
	}
</style>