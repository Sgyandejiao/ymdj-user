<template>
	<view class="content dis cl al_c">
		<view class="head dis cl al_c">
			<view class="top dis al_c">
				<view class="lef dis al_c">
					<image src="/static/512.png" mode="aspectFill"></image>
					<view class="info dis cl">
						<view class="t1">张三</view>
						<view class="t2">17325452454</view>
					</view>
				</view>
				<image class="rig" src="/static/icon/set.png" mode="widthFix"></image>
			</view>
			<view class="money_v dis cl al_c">
				<view class="t1">300.00<text>万元</text></view>
				<view class="t2">总收益</view>
			</view>
			<view class="num_v dis al_c">
				<view class="item dis cl al_c">
					<view class="t1">300.00元</view>
					<view class="t2">消费佣金</view>
				</view>
				<view class="line"></view>
				<view class="item dis cl al_c">
					<view class="t1">300.00元</view>
					<view class="t2">跑腿分成</view>
				</view>
			</view>
		</view>
		<view class="card dis al_c" style="margin-top: 20rpx;">
			<view class="lef dis cl ">
				<view class="t1"><text>￥</text>300.00</view>
				<view class="t2">余额</view>
			</view>
			<view class="rig" @click="cashOut">提现</view>
		</view>
		<view class="card dis al_c" style="margin-top: 2rpx;" @click="toSteam">
			<view class="itm">累计收入 ￥1.45万元</view>
			<view class="itm">累计提现 ￥1000.00元</view>
			<image class="itm_img" src="/static/icon/arrow-right.png" mode="widthFix"></image>
		</view>
		<view class="card dis al_c" style="margin-top: 20rpx;" @click="toAccount">
			<view class="itm">我的账户</view>
			<view class="itm">支付宝（13565545541）<text>解绑</text></view>
		</view>
		<view class="card dis al_c" style="margin-top: 2rpx;" @click="toChargeSet">
			<view class="itm">收费标准</view>
			<image class="itm_img" src="/static/icon/arrow-right.png" mode="widthFix"></image>
		</view>
		<view class="card dis al_c" style="margin-top: 2rpx;">
			<view class="itm">我的邀请码</view>
			<image class="itm_img" src="/static/icon/arrow-right.png" mode="widthFix"></image>
		</view>
		<view class="card dis al_c" style="margin-top: 2rpx;" @click="toSet">
			<view class="itm">设置</view>
			<image class="itm_img" src="/static/icon/arrow-right.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		created() {



		},
		onReady() {


		},
		mounted() {

		},
		methods: {
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
				uni.navigateTo({
					url: '/pages/set/set'
				})
			}
		}

	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
		padding-bottom: 100rpx;
	}

	.head {
		width: 750rpx;
		height: 700rpx;
		background-color: cornflowerblue;

		.top {
			width: 686rpx;
			justify-content: space-between;
			margin-top: 150rpx;

			.lef {
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}

				.info {
					margin-left: 20rpx;
					height: 120rpx;
					justify-content: space-between;

					view {
						color: #fff;
					}

					.t1 {
						font-size: 35rpx;
						font-weight: 550;
					}

					.t2 {
						font-size: 28rpx;
					}
				}
			}

			.rig {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 150rpx;
				margin-right: 20rpx;
			}
		}

		.money_v {
			margin-top: 30rpx;

			.t1 {
				font-size: 55rpx;
				font-weight: bold;
				color: #fff;

				text {
					font-size: 28rpx;
					font-weight: 500;
					margin-left: 12rpx;
				}
			}

			.t2 {
				font-size: 28rpx;
				color: #fff;
				margin-top: 20rpx;
			}
		}

		.num_v {
			width: 550rpx;
			margin-top: 50rpx;
			justify-content: space-between;

			view {
				color: #fff;
			}

			.line {
				width: 1rpx;
				height: 80rpx;
				border-right: 1rpx solid #fff;
			}
		}
	}

	.card {
		width: 686rpx;
		border-radius: 16rpx;
		background-color: #fff;
		padding: 20rpx 0;
		justify-content: space-between;

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
				color: #999;
				margin: 10rpx 0rpx 0 20rpx;
			}
		}

		.rig {
			width: 178rpx;
			height: 78rpx;
			border-radius: 16rpx;
			text-align: center;
			line-height: 78rpx;
			color: #fff;
			font-size: 30rpx;
			margin-right: 20rpx;
			background-color: dodgerblue;
		}

		.itm {
			line-height: 80rpx;
			font-size: 28rpx;
			margin-left: 20rpx;

			text {
				color: red;
				margin: 0 20rpx;
			}
		}

		.itm_img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
	}
</style>
