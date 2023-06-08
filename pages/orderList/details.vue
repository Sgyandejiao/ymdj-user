<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar bgColor="rgba(0,0,0,0)" :safeAreaInsetTop="true"  :placeholder="true" @leftClick="getBack">
			<view class="u-nav-slot" slot="left">
				<image src="/static/icon/arrow-left.png" style="width: 48rpx;height: 48rpx;" mode="widthFix"></image>
				<view class="u-nav-back-text">{{navTitle}} <text style="color:#F44850;margin-left: 6rpx;"
						v-if="(detail.replacementStatus==1||detail.replacementStatus==3)">{{Number(detail.replacementMoney).toFixed(2)}}</text></view>
			</view>
		</u-navbar>
		<view class="page_v dis cl al_c">
			<view class="card dis cl al_c" v-if="detail.orderTypeId==4">
				<view class="top_title dis al_c">
					<view class="t1">{{detail.orderTypeId==4?'代寄送':detail.orderType}}</view>
					<!-- <view class="t2">联系他</view> -->
				</view>
				<view class="content_text" v-if="detail.orderDesc">{{detail.orderDesc}}</view>
				<view class="img_v dis al_c" v-if="detail.imgList">
					<image :src="item" v-for="(item,index) in detail.imgList" :key="item" @click="preView(index,0)">
					</image>
				</view>
			</view>
			<view class="card dis cl al_c" v-if="detail.orderTypeId==4">
				<view class="item dis al_c" style="margin-bottom: 0;">
					<image class="icon" src="/static/icon/order/ji.png" mode="widthFix"></image>
					<view class="value" style="margin-left: 16rpx;font-size: 32rpx;">{{detail.pickupAddress}}</view>
				</view>
				<view class="item">
					<view class="line"> </view>
				</view>
				<view class="item add1  dis al_c" style="margin-bottom: 0;">
					<image class="icon" src="/static/icon/order/shou.png" mode="widthFix"></image>
					<view class="value" style="margin-left: 16rpx;font-size: 32rpx;">{{detail.receiveAddress}}</view>
				</view>
			</view>
			<view class="card dis cl al_c" v-if="detail.orderTypeId==4">
				<view class="item dis al_c" v-if="detail.orderType!='代购商品'&&detail.orderType!='万能帮'">
					<view class="title">物品数量</view>
					<view class="value">{{detail.quantity}}</view>
				</view>
				<view class="item dis al_c" style="margin-bottom: 0;"
					v-if="detail.orderType!='代购商品'&&detail.orderType!='万能帮'">
					<view class="title">物品重量</view>
					<view class="value">{{detail.weightDesc}}公斤</view>
				</view>
			</view>
			<view class="card dis cl al_c" v-if="detail.orderTypeId==4">
				<view class="item dis al_c">
					<view class="title">订单时间</view>
					<view class="value">{{detail.orderDate}}</view>
				</view>
				<view class="item dis al_c">
					<view class="title">订单编号</view>
					<view class="value">{{detail.orderCode}}</view>
				</view>
				<view class="item dis al_c">
					<view class="title">寄送费用</view>
					<view class="value" style="color: #F44850;">￥{{Number(detail.replacementMoney).toFixed(2)}}</view>
				</view>
				<view class="item dis al_c">
					<view class="title">支付状态</view>
					<view class="value">{{detail.replacementStatus==0?'未发起':detail.replacementStatus==2?'已完成':'待支付'}}
					</view>
				</view>
				<view class="item dis al_c">
					<view class="title">支付时间</view>
					<view class="value">{{detail.replacementPayDate || '--'}}</view>
				</view>
				<view class="item dis al_c" style="margin-bottom: 0;">
					<view class="title">支付方式</view>
					<view class="value" v-if="detail.replacementStatus!=2">--</view>
					<view class="value" v-else>{{detail.replacementPayType==0?'支付宝':'微信'}}</view>
				</view>
			</view>
			
			
			<view class="card dis cl al_c" v-if="detail.orderTypeId==2">
				<view class="desc-view">{{detail.replacementDesc}}</view>
				<view class="img-view dis al_c" >
					<view class="img" v-for="(item,index) in detail.replacementImage" :key="item" >
						<image :src="item" mode="aspectFill" @click="preView(index,1)"></image>
					</view>
				</view>
			</view>
			<view class="card dis cl al_c" v-if="detail.orderTypeId==2">
				<view class="item dis al_c" >
					<view class="title">补单金额</view>
					<view class="value" style="color:#F44850">￥{{detail.replacementMoney}}</view>
				</view>
				<view class="item dis al_c" >
					<view class="title">支付状态</view>
					<view class="value">{{detail.replacementStatus==2?'已支付':(detail.replacementStatus==1||detail.replacementStatus==3)?'等待支付':'未支付'}}</view>
				</view>
				<view class="item dis al_c" v-if="detail.replacementStatus==2">
					<view class="title">支付时间</view>
					<view class="value">{{detail.replacementPayDate}}</view>
				</view>
				<view class="item dis al_c" style="margin-bottom: 0rpx;" v-if="detail.replacementStatus==2">
					<view class="title">支付方式</view>
					<view class="value">{{detail.replacementPayType==0?'支付宝':'微信'}}</view>
				</view>
			</view>
		</view>

		<view class="botom_btn dis cl al_c" v-if="(detail.orderTypeId==4 || detail.orderTypeId==2)&&(detail.replacementStatus==1||detail.replacementStatus==3)">
			<view @click="showPaySelect=true">去支付</view>
		</view>
	
		<paySelect :showPaySelect="showPaySelect" isRecharge="0"  :payMoney="detail.replacementMoney" :orderCode="detail.orderCode" @payResult="payResult"
			@cancelPay="cancelPay"></paySelect>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	import paySelect from '@/components/paySelect.vue'
	export default {
		components: {
			headBgImg,
			paySelect
		},
		data() {
			return {
				showPaySelect: false,
				isShowPopup: false,
				modalText: '',
				detail: {},
				show: false,
				price: '',
				navTitle: '订单详情'
			};
		},
		onLoad(opt) {
			this.orderCode = opt.orderCode

		},
		onShow() {
			if (this.orderCode) {
				this.getData()
			}
			plus.nativeUI.closeWaiting()
		},
		methods: {
			
			// 支付结果
			payResult(e) {
				console.log('支付回调结果', e)
				if (e == 1) {
					this.showPaySelect = false
					this.getData()
				} else {
					this.showPaySelect = false
				}
			},
			cancelPay() {
				this.showPaySelect = false
			},
			getBack() {
				uni.navigateBack()
			},
			getData() {
				this.$util.request(this.$apis.getOrderDetail, {
					orderCode: this.orderCode
				}).then(r => {
					console.log('详情', r)
					if (r.status) {
						if (r.data.orderDescImage != '') {
							if (r.data.orderDescImage.indexOf(';') <= -1) {
								r.data['imgList'] = [r.data.orderDescImage]
							} else {
								r.data['imgList'] = r.data.orderDescImage.split(';')
							}
						}
						r.data.replacementImage = r.data.replacementImage?r.data.replacementImage.split(';'):[]
						// if (r.data.replacementImage != '') {
						// 	if (r.data.replacementImage.indexOf(';') <= -1) {
						// 		r.data['replacementImage'] = [r.data.replacementImage]
						// 	} else {
						// 		r.data['replacementImage'] = r.data.replacementImage.split(';')
						// 	}
						// }
						let orderStatus = r.data.orderStatus
						let replacementStatus = r.data.replacementStatus
						// this.navTitle = r.data.replacementStatus == 1 ? '等待支付' : r.data.replacementStatus == 2 ?
						// 	'已完成' : '订单详情'

						this.navTitle = (replacementStatus == 1||replacementStatus==3) ? '等待支付' : replacementStatus == 2 ?
							'已支付' : '订单详情'
						this.detail = r.data
						console.log('detail=',this.detail)

					} else {
						this.$toast(r.statusMessage)
					}
				})
			},
			preView(index,type) {
				uni.previewImage({
					urls: type==0?this.detail.imgList:this.detail.replacementImage,
					current: index
				})
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},


		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
		padding-bottom: 112rpx;
	}

	.head {
		width: 750rpx;
		height: 150rpx;

		justify-content: center;
		background-color: #fff;

		image {
			width: 50rpx;
			height: 50rpx;
			margin-right: 12rpx;
		}

		view {
			font-size: 30rpx;
			color: #333;
		}
	}

	.steps {
		width: 750rpx;
		height: 200rpx;
		background-color: #fff;
		position: relative;

		.detail_text {
			position: absolute;
			width: 750rpx;
			justify-content: space-around;
			left: 0;
			top: 90rpx;
			z-index: 99;

			view {
				font-size: 26rpx;

				margin-left: 160rpx;
			}

			.color1 {
				color: #2E6EEF;
			}

			.color2 {
				color: #fff;
			}
		}
	}

	.page_v {
		width: 750rpx;
		margin-top: 20rpx;
		// background-color: #fff;

		.top_title {
			width: 638rpx;
			// height: 80rpx;
			justify-content: space-between;

			view {
				font-size: 30rpx;
				font-weight: 550;
			}

			.t1 {
				color: #333;
			}

			.t2 {
				color: #F44850;
			}
		}
	}

	.line {
		width: 750rpx;
		height: 1rpx;
		border-bottom: 1rpx solid #eee;
		margin: 40rpx 0 0 0;
	}

	.content_text {
		width: 596rpx;
		padding: 24rpx;
		// min-height: 168rpx;
		font-size: 28rpx;
		background-color: #F8F8F8;
		margin-top: 24rpx;
		border-radius: 16rpx;
	}

	.img_v {
		width: 638rpx;
		margin: 20rpx 0 0 0;
		flex-wrap: wrap;

		image {
			width: 140rpx;
			height: 140rpx;
			margin-right: 16rpx;
			border-radius: 16rpx;
		}
	}

	.item {
		width: 638rpx;
		// height: 50rpx;
		margin-bottom: 32rpx;

		view {
			font-size: 28rpx;
			color: #333;
		}

		.title {
			width: 150rpx;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
		}

		.value {
			max-width: 586rpx;
			margin-left: 20rpx;
			color: #666666;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-left: 12rpx;
			}
		}
	}

	.card {
		width: 686rpx;
		padding: 40rpx 0;
		border-radius: 24rpx;
		background: #FFFFFF;
		margin-bottom: 16rpx;
	}

	.col {
		color: #F44850;
	}

	.botom_btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 132rpx;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px 1px rgba(0, 0, 0, 0.1);
		border-radius: 0px 0px 0px 0px;
		opacity: 1;
		z-index: 10;


		view {
			width: 686rpx;
			height: 80rpx;

			border-radius: 46rpx;
			opacity: 1;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
			margin-top: 16rpx;
		}

		.btn {
			background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
			color: #FFFFFF;
		}

		.btn1 {
			background: #CCCCCC;
			color: #FFFFFF;
		}
	}

	.popup_v {
		width: 640rpx;

		background: #FFFFFF;
		border-radius: 32rpx;
		padding: 30rpx 0;

		.swiper {
			width: 592rpx;
			height: 547rpx;
			margin: 24rpx;
			border-radius: 16rpx;

			.item_itm {
				width: 592rpx;
				height: 547rpx;
				position: relative;

				view {
					width: 80rpx;
					height: 40rpx;
					background: rgba(0, 0, 0, 0.7);
					border-radius: 20px 20px 20px 20px;
					text-align: center;
					line-height: 40rpx;
					font-size: 22rpx;
					color: #fff;
				}
			}

			image {
				width: 592rpx;
				height: 547rpx;
				background: #CCCCCC;
				border-radius: 16rpx;

			}
		}



		.content {
			width: 592rpx;
			margin: 0 24rpx;

			view {
				font-size: 32rpx;
				color: #999999;
				margin-bottom: 27rpx;

				text {
					color: #333;
					margin-left: 28rpx;
				}
			}

			;
		}
	}

	.close {
		width: 80rpx;
		height: 80rpx;
		margin: 41rpx 0 0 279rpx;
	}

	.add1 {
		// align-items: flex-start;

		.title {
			// padding: 10rpx 0;
		}



		.value {
			// padding: 10rpx;
			// background-color: whitesmoke;
			border-radius: 12rpx;
			width: 360rpx;

			// overflow: hidden;
			// text-overflow: ellipsis;
			// display: -webkit-box; // 作为弹性伸缩盒子模型显示。
			// -webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
			// -webkit-line-clamp: 1; // 显示的行

		}

	}

	.copy {
		font-size: 26rpx;
		color: #2E6EEF;
		margin-left: 16rpx;
		// padding: 10rpx 0;

	}

	.unit {
		font-size: 32rpx;
		color: #333333;
		margin-left: 24rpx;
	}

	input {
		font-size: 32rpx;
		color: #333;
		margin-left: 28rpx;
	}

	.popup {
		width: 640rpx;
		// height: 431rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		opacity: 1;

		.title {
			font-size: 34rpx;
			color: #000000;
			margin: 50rpx 0 54rpx 0;
		}

		.price {
			font-size: 68rpx;
			font-family: DIN Alternate-Bold, DIN Alternate;
			font-weight: bold;
			color: #333333;

			text {
				font-size: 40rpx;
				font-weight: 400;
			}
		}

		.btm {
			width: 100%;
			height: 123rpx;
			border-top: 1rpx solid #f0f0f0;
			justify-content: space-around;
			margin-top: 64rpx;

			view {
				font-size: 34rpx;
				text-align: center;
				line-height: 123rpx;
			}

			.b1 {
				width: 288rpx;
				height: 123rpx;
				color: #000000;
			}

			.line {
				width: 1rpx;
				height: 112rpx;
				border-right: 1rpx solid #f0f0f0;
			}

			.b2 {
				width: 288rpx;
				color: #F44850;
			}
		}
	}

	.line {
		width: 586rpx;
		border-bottom: 1rpx solid #f0f0f0;
		margin-left: 52rpx;
	}


	.desc-view{
		width: 590rpx;
		min-height: 168rpx;
		background: #F8F8F8;
		border-radius: 16rpx;
		padding: 24rpx;
		font-size: 28rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
	}
	
	.img-view{
		width: 638rpx;
		align-items: flex-start;
		margin-top: 16rpx;
		.img{
			width: 140rpx;
			height: 140rpx;
			background: #DEDEDE;
			margin-right: 16rpx;
			border-radius: 16rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
	}

	.botom_btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 112rpx;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px 1px rgba(0, 0, 0, 0.1);
		border-radius: 0px 0px 0px 0px;
		opacity: 1;
		z-index: 10;

		view {
			width: 686rpx;
			height: 80rpx;
			background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
			border-radius: 46rpx;
			opacity: 1;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
			margin-top: 16rpx;
		}
	}
</style>
