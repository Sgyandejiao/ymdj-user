<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="设置" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
		</u-navbar>
		<view class="card dis  cl al_c">
			<view class="item dis al_c" @click="clearstroage">
				<view class="lef dis al_c">清除缓存</view>
				<view class="rig dis al_c">
					<view class="co_999">{{strogeSize}}</view>
					<image src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="item dis al_c" @click="toAbout">
				<view class="lef dis al_c">关于我们</view>
				<view class="rig dis al_c">
					<image src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="item dis al_c" @click="toAgreement('用户协议')">
				<view class="lef dis al_c">用户协议</view>
				<view class="rig dis al_c">
					<image src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="item dis al_c" @click="toAgreement('隐私政策')">
				<view class="lef dis al_c">隐私政策</view>
				<view class="rig dis al_c">
					<image src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="item dis al_c" @click="showModal('是否确定注销账号')">
				<view class="lef dis al_c">注销账号</view>
				<view class="rig dis al_c">
					<image src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="item dis al_c">
				<view class="lef dis al_c">版本号</view>
				<view class="rig dis al_c">
					<view class="co_999">v{{version}}</view>
				</view>
			</view>

		</view>

		<view class="btn" @click="showModal('是否确定退出登录')">退出</view>
		<u-modal :title="modalText" :show="isShowModal" :showCancelButton="true" confirmColor="#F44850"
			@confirm="confirmModal" @cancel="isShowModal=false"></u-modal>
	</view>
</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data() {
			return {
				isShowModal: false,
				modalText: '',
				isIOS: true,
				version: 'v1.0.0',
				strogeSize: ''
			};
		},
		onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				console.log('本地版本', "v" + inf.version)
				this.version = inf.version
			})
			this.getStorageSize()
			if (plus.os.name == 'Android') {
				this.isIOS = false
			} else {
				this.isIOS = true
			}
			Alibcsdk.init(result => {
				console.log('百川初始化', result)
			});
		},

		methods: {
			showModal(text) {
				this.modalText = text
				this.isShowModal = true
			},
			confirmModal() {
				if (this.modalText == '是否确定退出登录') {
					this.loginOut()
				} else if ('是否确定注销账号') {
					this.loginOutAccount()
				}
				this.isShowModal = false
			},
			getStorageSize() {
				let self = this;
				plus.cache.calculate(size => {
					console.log(size)
					if (size < 1024) {
						self.strogeSize = size + 'B';
					} else if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
						self.strogeSize = Math.floor((size / 1024) * 100) / 100 + 'KB';
					} else if (size / 1024 / 1024 >= 1) {
						self.strogeSize = Math.floor((size / 1024 / 1024) * 100) / 100 + 'M';
					}
				});
			},
			clearstroage() {
				let self = this;
				plus.cache.clear(res => {
					uni.showToast({
						title: '清除缓存成功！',
						icon: 'none',
						success() {
							self.strogeSize = '0B';
							self.getStorageSize()
						}
					});
				});
			},
			loginOut() {
				// 个推解绑别名
				// #ifdef APP-PLUS
				let alias = uni.getStorageSync('alias') || ''
				console.log('解绑cid', alias)

				if (plus.os.name == 'Android') {
					let PushManager = plus.android.importClass("com.igexin.sdk.PushManager");
					let context = plus.android.runtimeMainActivity().getContext();
					let Instance = PushManager.getInstance();
					Instance.unBindAlias(context, alias, true);
				} else {
					let GeTuiSdk
					GeTuiSdk = plus.ios.importClass("GeTuiSdk");
					GeTuiSdk.unbindAliasandSequenceNumandIsSelf(alias, alias, true);
				}
				// #endif 
				uni.removeStorageSync('userType')
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('ftoken')
				uni.clearStorage()
				plus.cache.clear();
				Alibcsdk.logout(
					result => {
						if (result.status) {
							console.log('登出成功');
						}
					});

				uni.switchTab({
					url: '/pages/home/index'
				})
			},
			toClear() {
				uni.showToast({
					title: '清除成功',
					icon: 'success'
				})
			},
			toAbout() {
				console.log('------')
				uni.navigateTo({
					url: '/pages/set/about'
				})
			},
			toAgreement(title) {
				console.log('title=', title)
				uni.navigateTo({
					url: '/pages/webView/index?title=' + title
				})
			},
			loginOutAccount() {
				uni.removeStorageSync('userType')
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('ftoken')
				uni.clearStorage()
				uni.switchTab({
					url: '/pages/home/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		background-color: #f0f0f0;
	}

	.card {
		position: relative;
		z-index: 99;
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
	}

	.item {
		width: 638rpx;
		height: 112rpx;
		// background-color: #fff;
		justify-content: space-between;

		.lef {
			// margin-left: 30rpx;
			font-size: 30rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;

			}
		}

		.rig {
			// margin-right: 30rpx;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			view {
				font-size: 30rpx;
				margin-right: 20rpx;
			}
		}

	}

	.line {
		width: 638rpx;
		// height: 1rpx;
		border-bottom: 1rpx solid #F0F0F0;
	}

	.btn {
		position: fixed;
		bottom: 100rpx;
		// left: 0;
		// background-color: white;
		width: 686rpx;
		height: 88rpx;
		border: 1rpx solid #999999;
		color: #333;
		font-size: 32rpx;
		text-align: center;
		line-height: 88rpx;
		margin-top: 26rpx;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		z-index: 10;
	}

	.co_999 {
		color: #999;
	}
</style>