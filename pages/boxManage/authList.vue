<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="授权管理" bgColor="rgba(0,0,0,0)" :placeholder="true" :safeAreaInsetTop="true"
			@rightClick="addAuth" @leftClick="getBack">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon//arrow-left.png" mode="widthFix"></image>
			</view>
			<view class="u-nav-slot" slot="right">
				<view class="u-nav-rig-text" style="color: #2E6EEF;">添加授权</view>
			</view>
		</u-navbar>

		<view class="list dis cl ">
			<view class="item dis cl al_c" v-for="(item,index) in list" :key="item.authId">
				<view class="cell dis al_c">
					<view class="title">账号手机：</view>
					<view class="value">{{item.authMobile}}</view>
				</view>
				<view class="cell dis al_c">
					<view class="title">授权时间：</view>
					<view class="value ">{{item.authTime}}</view>
				</view>
				<view class="cell dis al_c">
					<view class="title">授权类型：</view>
					<view class="value co_f44850">{{item.authType==1?'永久授权':'临时授权'}}</view>
				</view>
				<view class="cell dis">
					<view class="title">备注：</view>
					<view class="value" style="width: 470rpx;">{{item.authDesc}}</view>
				</view>
				<view class="btm_v dis al_c">
					<view class="btn" @click="del(item.authId)">删除授权</view>
				</view>
			</view>

		</view>
		<u-modal title="提示" content="授权设备数已达上限，无法添加授权" :show="isShowModal" confirmColor="#F44850"
			@cancel="isShowModal=false" @confirm="isShowModal=false"></u-modal>
		<view class="no_data" v-if="!list.length">暂时没有授权数据</view>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	export default {
		components: {
			headBgImg
		},
		data() {
			return {
				list: [],
				scanCode: '',
				deviceName: '',
				isShowModal: false,
				modalText: ''
			};
		},
		onLoad(opt) {
			this.scanCode = opt.scanCode
			this.deviceName = opt.deviceName
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				let data = {
					deviceCode: this.scanCode
				}
				this.$util.request(this.$apis.getAuthList, data).then(res => {
					console.log('授权设备列表', res)
					if (res.status) {
						if (res.data) {
							res.data.forEach(item => {
								item['authMobile'] = this.$tuomin(item.authMobile, 'phone')
							})
						}
						this.list = res.data ? res.data : []
					}
				})
			},
			del(id) {
				plus.nativeUI.showWaiting()
				let data = {
					id
				}
				this.$util.request(this.$apis.deleteAuthInfo, data).then(res => {
					console.log('删除授权', res)
					plus.nativeUI.closeWaiting()
					if (res.status) {
						plus.nativeUI.closeWaiting()
						this.$toast('删除成功')
						this.getData()
					} else {
						this.$toast(res.statusMessage)
					}
				})
			},
			getBack() {
				uni.navigateBack()
			},
			addAuth() {

				let data = {
					deviceCode: this.scanCode
				}
				this.$util.request(this.$apis.getAuthList, data).then(res => {
					console.log('授权设备列表', res)
					if (res.status) {
						res.data = res.data ? res.data : []
						if (res.data) {
							res.data.forEach(item => {
								item['authMobile'] = this.$tuomin(item.authMobile, 'phone')
							})
							this.list = res.data ? res.data : []
						}
						if (res.data && res.data.length < 8) {
							uni.navigateTo({
								url: '/pages/boxManage/auth?scanCode=' + this.scanCode + '&deviceName=' +
									this.deviceName
							})
						} else {
							this.isShowModal = true
						}
					}
				})


			},

		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		background-color: #f0f0f0;
	}

	.no_data {
		width: 750rpx;
		text-align: center;
		margin-top: 300rpx;
		font-size: 30rpx;
		color: #666666;
	}
	.head{
		width: 750rpx;
		background: #f0f0f0;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;
	}
	.list {
		position: relative;
		left: 0;
		// top: 170rpx;
		z-index: 1;
		// width: 750rpx;
		padding-top: 20rpx;

		.item {
			width: 686rpx;
			// height: 450rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			opacity: 1;
			padding-top: 20rpx;
			margin-bottom: 20rpx;

			.cell {
				width: 638rpx;
				display: flex;
				justify-content: flex-start;
				margin: 24rpx 0 0 0;

				.title {
					width: 150rpx;
					font-size: 28rpx;
					color: #999999;
				}

				.value {
					font-size: 28rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
				}
			}

			.btm_v {
				width: 638rpx;
				height: 96rpx;
				margin-top: 44rpx;
				border-top: 1rpx solid #eee;
				justify-content: flex-end;

				.btn {
					width: 160rpx;
					height: 64rpx;
					background: #FFFFFF;
					border-radius: 32rpx;
					opacity: 1;
					border: 2rpx solid #999999;
					text-align: center;
					line-height: 64rpx;
					font-size: 28rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #666666;
					position: relative;
					z-index: 999;
				}
			}
		}

	}

	.co_f44850 {
		color: #F44850;
	}
</style>