<template>
	<view class="content dis cl al_c">
		<!-- 顶部 -->
		<view class="head dis al_c">
			<view class="lef dis al_c" @click="toNavigatto(1)">
				<image src="/static/512.png" mode="widthFix"></image>
				<view>某某小区</view>
			</view>
			<view class="rig dis al_c">
				<view>雨天</view>
				<switch :checked="isRain" @change="rainChange" />
			</view>
		</view>

		<!-- 数据面板 -->
		<view class="page_v dis cl al_c">
			<view class="card dis cl al_c">
				<view class="date_text dis al_c">
					<view>数据更新时间 2022-08-12 12:12:00</view>
					<image src="/static/icon/update.png" mode="widthFix"></image>
				</view>
				<view class="itm dis al_c">
					<view class="son dis cl al_c" @click="toNavigatto(2)">
						<view class="num"><text>￥</text>0.00</view>
						<view class="title">今日预估收益</view>
					</view>
					<view class="son dis cl al_c">
						<view class="num">3</view>
						<view class="title">今日跑腿订单</view>
					</view>
					<view class="son dis cl al_c">
						<view class="num">3</view>
						<view class="title">今日消费订单</view>
					</view>
				</view>
				<view class="itm dis al_c">
					<view class="son dis cl al_c" @click="toNavigatto(3)">
						<view class="num">3</view>
						<view class="title">店铺数量</view>
					</view>
					<view class="son dis cl al_c">
						<view class="num">3</view>
						<view class="title">驿站数量</view>
					</view>
					<view class="son dis cl al_c">
						<view class="num">3</view>
						<view class="title">快递柜数量</view>
					</view>
				</view>
				<view class="itm dis al_c">
					<view class="son dis cl al_c" @click="toNavigatto(7)">
						<view class="num">3</view>
						<view class="title">魔盒数量</view>
					</view>
					<view class="son dis cl al_c" @click="toNavigatto(5)">
						<view class="num">3</view>
						<view class="title">跑腿人员数量</view>
					</view>
					<view class="son dis cl al_c" @click="toNavigatto(6)">
						<view class="num">3</view>
						<view class="title">用户数量</view>
					</view>
				</view>
			</view>
			<view class="card notice dis al_c">
				<view class="lef dis al_c">
					<image src="/static/icon/notic.png" mode="widthFix"></image>
					<view>消息内容</view>
				</view>
				<image class="rig" src="/static/icon/arrow-right.png" mode="widthFix"></image>
			</view>
			<video class="video" id="myVideo"
				src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"
				@error="videoErrorCallback" controls></video>
			<view class="order_title dis al_c">
				<view class="title">最新订单</view>
				<view class="rig dis al_c" @click="toNavigatto(4)">订单大厅 <image src="/static/icon/arrow-right1.png"
						mode="widthFix"></image>
				</view>
			</view>
			<view class="card order dis cl al_c">
				<view class="top dis al_c">
					<view class="t1">代取快递</view>
					<view class="order_num">￥1.00</view>
				</view>
				<view class="address1">银丰花园小区1号快递柜</view>
				<view class="address2">杭州市滨江区粉丝花园</view>
				<view class="btm dis al_c">
					<view class="time">08-10 19:24</view>
					<view class="btn">接单</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				isRain: false
			};
		},
		methods: {
			rainChange(e) {
				// this.isRain = !this.isRain
			},
			toNavigatto(index) {
				let url = ''
				if (index == 1) {
					url = '/pages/communityList/communityList'
				} else if (index == 2) {
					url = '/pages/divide/divide'
				} else if (index == 3) {
					url = '/pages/store/store'
				} else if (index == 4) {
					url = '/pages/orderList/orderList'
				}else if(index==5){
					url = '/pages/worderManage/worderManage'
				}else if(index==6){
					url = '/pages/communityList/memberList'
				}else if(index==7){
					url = '/pages/boxManage/boxManage'
				}
				console.log('url=',url)
				uni.navigateTo({
					url: url
				})
			},
			videoErrorCallback() {

			},
			
		},
		onShow() {

		},
		onPullDownRefresh() {

		},
		created() {

		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
	}

	.head {
		width: 750rpx;
		height: 200rpx;
		background-color: dodgerblue;
		justify-content: space-between;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;

		.lef {
			margin: 0 0 22rpx 30rpx;

			image {
				width: 50rpx;
				height: 50rpx;

			}

			view {
				font-size: 26rpx;
				color: #fff;
				margin-left: 18rpx;
			}
		}

		.rig {
			margin: 0 30rpx 22rpx 0;

			view {
				font-size: 26rpx;
				color: #fff;
				margin-right: 18rpx;
			}
		}
	}

	.page_v {
		width: 100%;
		margin-top: 200rpx;
	}

	.card {
		width: 710rpx;
		// height: 450rpx;
		background-color: #fff;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 20rpx;

		.date_text {
			width: 600rpx;
			margin: 20rpx 0;

			view {
				font-size: 26rpx;
				color: #999;
			}

			image {
				width: 45rpx;
				height: 45rpx;
				margin-left: 16rpx;
			}
		}

		.itm {
			width: 600rpx;
			justify-content: space-between;
			margin: 20rpx 0;

			.son {
				width: 150rpx;
				overflow: hidden;

				.num {
					font-size: 30rpx;
					color: #333;
				}

				.title {
					width: 100%;
					text-align: center;
					font-size: 26rpx;
					color: #999;
					margin-top: 6rpx;
				}
			}
		}


	}

	.notice {
		height: 120rpx;
		justify-content: space-between;

		.lef {
			margin-left: 20rpx;

			image {
				width: 50rpx;
				height: 50rpx;
			}

			view {
				margin-left: 20rpx;
				width: 480rpx;
				font-size: 28rpx;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

			}
		}

		.rig {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
	}

	.video {
		width: 710rpx;
		height: 200rpx;
		margin-top: 20rpx;
	}

	.order_title {
		width: 710rpx;
		justify-content: space-between;
		margin: 50rpx 0 10rpx 0;

		.title {
			font-size: 28rpx;
			font-weight: bold;
		}

		.rig {
			font-size: 28rpx;
			color: dodgerblue;

			image {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.order {
		margin-top: -5rpx;

		.top {
			width: 600rpx;
			height: 70rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #eee;

			.t1 {
				font-size: 28rpx;
				color: #999;
			}

			.order_num {
				font-size: 28rpx;
				color: red;
			}
		}

		.address1,
		.address2 {
			width: 600rpx;
			font-size: 28rpx;
			margin: 30rpx 0 0 0;
		}

	}

	.btm {
		width: 600rpx;
		height: 100rpx;
		border-top: 1rpx solid #eee;
		margin-top: 30rpx;
		justify-content: space-between;

		.time {
			font-size: 26rpx;
			color: #999;
		}

		.btn {
			width: 120rpx;
			height: 60rpx;
			background-color: dodgerblue;
			text-align: center;
			line-height: 60rpx;
			font-size: 26rpx;
			color: #fff;
			border-radius: 50rpx;
		}
	}
</style>
