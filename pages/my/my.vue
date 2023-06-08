<template>
	<view class="content dis cl al_c" >
		<view class="head dis cl al_c">
			<image class="bg_img" src="/static/images/my-bg.png" mode="aspectFill"></image>
			<view class="top dis al_c">
				<view class="lef dis al_c">
					<image src="/static/images/default-avatar.png" mode="aspectFill"></image>
					<view class="info dis cl">
						<!-- <view class="t1">{{info.realName || ''}}</view> -->
						<view class="t2" v-if="boxInfo.deviceCode!=''">{{info.mobile || phone}}</view>
						<view class="t2" v-if="boxInfo.deviceCode==''">未绑定魔盒</view>
						<view class="t1" v-if="boxInfo.deviceCode==''">{{info.mobile || phone}}</view>
					</view>
				</view>
				<!-- <image class="rig" src="/static/icon/set.png" mode="widthFix" @click="toSet"></image> -->
			</view>
		</view>

		<view class="page_card dis cl al_c">
			<view class="order-card">
				<view class="top dis al_c">
					<view class="lef dis al_c"> 我的订单 </view>
					<view class="rig dis al_c" @click="toOrder(0)">查看全部订单 <image src="/static/icon/arrow-right2.png"
							mode=""></image>
					</view>
				</view>
				<view class="cell dis al_c">
					<view class="item dis cl al_c" @click="toOrder(1)">
						<image src="/static/icon/order/order1.png" mode="aspectFill"></image>
						<view class="title">待支付</view>
						<view class="point" v-if="isUnPay==1"> </view>
					</view>
					<view class="item dis cl al_c" @click="toOrder(2)">
						<image src="/static/icon/my/icon8.png" mode="aspectFill"></image>
						<view class="title">待接单</view>
					</view>
					<view class="item dis cl al_c" @click="toOrder(3)">
						<image src="/static/icon/my/icon9.png" mode="aspectFill"></image>
						<view class="title">服务中</view>
					</view>
					<view class="item dis cl al_c" @click="toOrder(4)">
						<image src="/static/icon/my/icon10.png" mode="aspectFill"></image>
						<view class="title">已完成</view>
					</view>
				</view>
			</view>
			<view class="cell-list dis cl al_c">
				<view class="card bor bg_fff dis al_c" style="margin-top:0rpx;" @click="coupon">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/icon1.png" mode="aspectFill"></image>
						<view class="itm">优惠券</view>
					</view>
					<view class="itm dis al_c" style="color: #666666;">{{couponNum}}张<image class="itm_img"
							src="/static/icon/arrow-right2.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="card-line"> </view>
				<view class="card bor_t bg_fff dis al_c" @click="toBoxManage">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/icon2.png" mode="aspectFill"></image>
						<view class="itm">我的魔盒</view>
					</view>
					<image class="itm_img" src="/static/icon/arrow-right2.png" mode="aspectFill"></image>
				</view>
				<view class="card-line"> </view>
				<view class="card bor_t bg_fff dis al_c" @click="address">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/address.png" mode="aspectFill"></image>
						<view class="itm">地址管理</view>
					</view>
					<image class="itm_img" src="/static/icon/arrow-right2.png" mode="aspectFill"></image>
				</view>
				<view class="card-line"> </view>
				<view class="card bg_fff dis al_c" @click="message">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/icon4.png" mode="widthFix"></image>
						<view class="itm">我的消息</view>
					</view>
					<image class="itm_img" src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
				<view class="card-line"> </view>
				<view class="card bor_b bg_fff dis al_c">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/scan.png" mode="widthFix"></image>
						<view class="itm-view dis cl">
							<view class="itm">切换扫码方式</view>
							<view class="sub-text">若无法识别设备二维码，请点击切换扫码方式再试</view>
						</view>
					</view>
					<switch :checked="isChangeScan" color="#F73740" @change="changeScan" />
				</view>
			</view>
			<view class="cell-list dis cl al_c" style="margin-top: 17rpx;">
				<view class="card bor_t bg_fff dis al_c" @click="toAbout">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/icon5.png" mode="widthFix"></image>
						<view class="itm">帮助中心</view>
					</view>
					<image class="itm_img" src="/static/icon/arrow-right2.png" mode="widthFix"></image>
				</view>
				<view class="card-line"> </view>
				<view class="card bor_b bg_fff dis al_c" @click="toSet">
					<view class="dis al_c">
						<image class="lef_img" src="/static/icon/my/icon6.png" mode="widthFix"></image>
						<view class="itm">设置</view>
					</view>
					<view>
						<image class="itm_img" src="/static/icon/arrow-right2.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				boxInfo: {
					deviceCode: ''
				},
				phone: '',
				info: {},
				couponNum: 0,
				isIOS: true,
				isShenhe: true,
				isChangeScan: false,
				isUnPay: 0
			};
		},
		onLoad() {

		},
		onShow() {
			uni.setStorageSync('lastPage', 3)
			if (plus.os.name == 'Android') {
				this.isIOS = false
			} else {
				this.isIOS = true
			}
			if (uni.getStorageSync('isShenhe') == 0) {
				this.isShenhe = false
			}
			this.geUserInfo()
			this.getData()
			this.closeWebview()
			if (uni.getStorageSync('isUnPay') && uni.getStorageSync('isUnPay') == 1) {
				this.isUnPay = uni.getStorageSync('isUnPay')
			} else {
				this.isUnPay = 0
				uni.hideTabBarRedDot({
					index: 3
				})
			}
		},

		created() {

		},
		onReady() {


		},
		mounted() {

		},
		methods: {
			changeScan(e) {
				console.log(e)
				uni.setStorageSync('isChangeScan', e.detail.value ? 1 : 0)
				this.$toast('切换成功')
			},
			toOrder(index) {
				uni.navigateTo({
					url: '/pages/orderList/orderList?index=' + index
				})
			},
			toAbout() {
				uni.navigateTo({
					url: '/pages/set/about'
				})
			},
			goodsOrder() {
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			coupon() {
				uni.navigateTo({
					url: '/pages/my/coupon?from=1'
				})
			},
			address() {
				uni.navigateTo({
					url: '/pages/address/receive'
				})
			},
			message() {
				uni.navigateTo({
					url: '/pages/message/message'
				})
			},
			getData() {
				this.$util.request(this.$apis.getUserBindDevice).then(res => {
					console.log('首页设备数据', res)
					if (res.status) {
						this.boxState = res.resultValue
						if (res.data && res.data != null) {
							this.boxInfo = res.data
						}
					}
				})
				this.$util.request(this.$apis.getCouponList, {
					type: 0
				}).then(r => {
					console.log('我的优惠券', r)
					if (r.status && r.data) {
						this.couponNum = r.data.length
					}
				})
				let data = {
					type: '待支付',
					pageIndex: 1,
					pageSize: 10
				}
				this.$util.request(this.$apis.getUserOrderList, data).then(r => {
					console.log('待支付订单', r)
					if (r.status) {
						let isUnPay = r.data.length ? 1 : 0
						uni.setStorageSync('isUnPay', isUnPay)
					} else {
						this.isUnPay = 0
						uni.hideTabBarRedDot({
							index: 3
						})
					}
				})
			},
			geUserInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					console.log('用户信息1', res)
					if (res.status) {
						this.phone = this.$tuomin(res.data.mobile, 'phone')
					}
				})
			},
			toBoxManage() {
				console.log('------box')
				uni.navigateTo({
					url: '/pages/boxManage/boxManage'
				})
			},
			toChargeSet() {
				uni.navigateTo({
					url: '/pages/chargeSet/chargeSet'
				})
			},
			cashOut() {
				console.log('eee')
				uni.navigateTo({
					url: '/pages/cashOut/cahsOut'
				})
			},
			toAccount() {
				uni.navigateTo({
					url: '/pages/cashOut/account'
				})
			},
			toSteam() {
				uni.navigateTo({
					url: '/pages/cashOut/steam'
				})
			},
			toSet() {
				console.log('------set')
				uni.navigateTo({
					url: '/pages/set/set'
				})
			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: '400-8554554'
				})
			},
			closeWebview() {
				plus.webview.close('test');
			},
		}

	}
</script>

<style lang="scss">
	@import '~@/common/scss/mixins.scss';

	page {
		width: 750rpx;
		background-color: #f0f0f0;
		// padding-bottom: 100rpx;
	}

	.page_card {
		width: 750rpx;
		position: relative;
		z-index: 999;
		left: 0;
		top: 20rpx;
	}

	.head {
		width: 750rpx;
		// height: 700rpx;
		// background-color: cornflowerblue;


		.bg_img {
			position: absolute;
			left: 0;
			top: 0;
			width: 750rpx;
			height: 538rpx;
			z-index: -10;

		}

		.top {
			width: 686rpx;
			justify-content: space-between;
			margin-top: 150rpx;

			.lef {
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					border: 5rpx solid #fff;
				}

				.info {
					margin-left: 20rpx;
					height: 120rpx;
					justify-content: center;

					view {
						color: #333;
					}

					.t1 {
						font-size: 32rpx;
						// font-weight: 550;
						color: #666666;
					}

					.t2 {
						font-size: 40rpx;
						font-family: PingFang SC-Bold, PingFang SC;
						font-weight: bold;
						color: #222222;

					}
				}
			}

			.rig {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 150rpx;
				margin-right: 32rpx;
			}
		}

		.money_v {
			margin-top: 30rpx;

			.t1 {
				font-size: 55rpx;
				font-weight: bold;
				color: #333;

				text {
					font-size: 28rpx;
					font-weight: 500;
					margin-left: 12rpx;
				}
			}

			.t2 {
				font-size: 28rpx;
				color: #333;
				margin-top: 20rpx;
			}
		}

		.num_v {
			width: 550rpx;
			margin-top: 50rpx;
			justify-content: space-between;

			view {
				color: #333;
			}

			text {
				color: #666666;
				font-weight: 400;
				font-size: 34rpx;
			}

			.line {
				width: 1rpx;
				height: 80rpx;
				border-right: 1rpx solid #CCC;
			}

			.t1 {
				font-size: 36rpx;
				font-weight: bold;
			}

			.t2 {
				font-size: 24rpx;
				color: #666666;
				margin-top: 8rpx;
			}
		}
	}


	.card {
		width: 686rpx;
		padding: 20rpx 0;
		justify-content: space-between;

		.lef_img {
			width: 56rpx;
			height: 56rpx;
			margin-left: 24rpx;
		}

		.lef {
			justify-content: center;
			margin-left: 20rpx;

			.t1 {
				font-size: 55rpx;

				text {
					font-size: 26rpx;
				}
			}

			.t2 {
				font-size: 28rpx;
				color: #dcdcdc;
				margin: 10rpx 0rpx 0 20rpx;
			}
		}

		.rig {
			width: 134rpx;
			height: 56rpx;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			text-align: center;
			line-height: 56rpx;
			font-size: 28rpx;
			margin-right: 33rpx;
			background: #FFFFFF;
			color: #457FF3;
		}

		.itm {
			line-height: 80rpx;
			font-size: 28rpx;
			margin-left: 20rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;

			text {

				color: red;
				margin: 0 20rpx;
			}
		}

		.itm-view {
			margin-left: 20rpx;

			.itm {
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin-left: 0;
				line-height: 28rpx;
				margin-top: 10rpx;
			}

			.sub-text {
				width: 400rpx;
				font-size: 24rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				margin-top: 10rpx;
			}
		}

		.itm_img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
	}

	.card_num {
		position: relative;

		view {
			color: #fff;
		}

		.bg_img {
			width: 100%;
			height: 238rpx;
			position: absolute;
			z-index: -10;
			top: 0;
			left: 0;
		}
	}

	.bor {
		border-radius: 16rpx;
	}

	.bor_t {
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
	}

	.bor_b {
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}

	.bg_fff {

		background-color: #fff;
	}

	.order-card {
		width: 686rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin-bottom: 26rpx;
		padding: 0 0 26rpx 0;

		.top {
			width: 100%;
			height: 92rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #f0f0f0;
			line-height: 92rpx;

			.lef {
				margin-left: 30rpx;
				font-size: 30rpx;
				color: #333;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;

				image {
					@include setBox(52rpx, 52rpx) margin-right: 16rpx;
				}
			}

			.rig {
				margin-right: 32rpx;
				font-size: 26rpx;
				color: #666;

				image {
					@include setBox(28rpx, 28rpx) margin-left: 8rpx;
				}
			}
		}

		.cell {
			width: 686rpx;
			justify-content: space-around;
			margin-top: 26rpx;

			.item {
				position: relative;

				image {
					@include setBox(48rpx, 48rpx);
				}

				view {
					@include setFont(26rpx) margin-top: 12rpx;
				}

				.point {
					width: 15rpx;
					height: 15rpx;
					background-color: #F44850;
					border-radius: 50%;
					position: absolute;
					right: 0;
					top: -10rpx;
					z-index: 90;
				}
			}
		}
	}

	.cell-list {
		width: 686rpx;
		background-color: #fff;
		border-radius: 12rpx;
	}

	.card-line {
		width: 638rpx;
		height: 2rpx;
		background-color: #f0f0f0;
	}
</style>