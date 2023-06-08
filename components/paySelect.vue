<template>
	<view class="content dis cl al_c">
		<!-- <u-popup :show="showPaySelect" :closeOnClickOverlay="true" :round="20" mode="bottom">
			<view class="pop_body dis cl">
				<view class="itm dis al_c j_c" @click="submit(0)">
					<image src="/static/icon/alipay.png" mode="widthFix"></image>
					<view>支付宝支付</view>
				</view>
				<view class="itm dis al_c j_c" @click="submit(1)">
					<image src="/static/icon/wepay.png" mode="widthFix"></image>
					<view>微信支付</view>
				</view>
				<u-gap height="8" bgColor="#F0F0F0"></u-gap>
				<view class="cancel_btn" @click="cancelPay">取消</view>
			</view>
		</u-popup> -->
		<u-popup :show="showPaySelect" :closeOnClickOverlay="true" :round="20" mode="bottom">
			<view class="pop_body1 dis cl al_c">
				<view class="top-title dis al_c">
					<view class="lef"> </view>
					<view>请选择支付方式</view>
					<image src="/static/icon/recharge/close.png" mode="widthFix" @click="cancelPay"></image>
				</view>
				<view class="parce dis">
					<view>￥</view>{{payMoney}}
				</view>
				<!-- <view class="time-text dis al_c">
					<view class="text">请在</view>
					<view class="text1" style="color:#FF8327 ;">
						<u-count-down :time="5 * 60 * 1000" format="mm:ss" autoStart millisecond @change="onChange">
							<view class="time">
								<text class="time__item">{{ timeData.minutes }}分</text>
								<text class="time__item">{{ timeData.seconds }}秒内</text>
							</view>
						</u-count-down>
					</view>
					<view class="text">完成支付</view>
				</view> -->
				<view class="select-item dis al_c" @click="payIndex=!payIndex">
					<view class="lef dis al_c">
						<image src="/static/icon/recharge/wepay.png" mode="widthFix"></image>
						<view>微信支付</view>
					</view>
					<image class="rig" src="/static/icon/selects1.png" mode="widthFix" v-if="payIndex==0" ></image>
					<image class="rig" src="/static/icon/recharge/select.png" mode="widthFix" v-else></image>
				</view>
				<view class="select-item dis al_c" style="margin-top: 20rpx;" @click="payIndex=!payIndex">
					<view class="lef dis al_c">
						<image src="/static/icon/recharge/alipay.png" mode="widthFix"></image>
						<view>支付宝支付</view>
					</view>
					<image class="rig" src="/static/icon/selects1.png" mode="widthFix" v-if="payIndex==1" ></image>
					<image class="rig" src="/static/icon/recharge/select.png" mode="widthFix" v-else></image>
				</view>
				<view class="payBtn dis al_c j_c" >
					<view @click="submit(payIndex==0?1:0)">确认支付</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			showPaySelect: false,
			orderCode: '',
			payFrom: '',
			payMoney:0,
			isRecharge:0,
			telPhone:'',
			productId:''
		},
		data() {
			return {
				timeData: {},
				payIndex:0
			}
		},
		onShow() {
			plus.nativeUI.closeWaiting()
		},
		methods: {
			onChange(e) {
				// console.log(e)
				this.timeData = e
			},
			cancelPay() {
				this.$emit('cancelPay')
			},
			submit(payType) {
				plus.nativeUI.showWaiting()
				if(this.isRecharge==0){
					let data = {
						"orderCode": this.orderCode,
						"payType": payType
					}
					console.log('支付补单入参', data)
					
					this.$util.request(this.$apis.repalacementPay, data, 'POST').then(r => {
						console.log('支付补单', r)
						plus.nativeUI.closeWaiting()
						if (r.status) {
							if (payType == 0) {
								this.payMent(r.resultValue, payType)
							} else {
								this.payMent(r.data, payType)
							}
						} else {
							this.$toast(r.statusMessage)
						}
					
					})
				}else{
					
					// 获取支付参数
					let subPay = (orderId)=>{
						let data = {
							"orderId": orderId,
							"payType": payType
						}
						console.log('支付订单入参',data)
						this.$util.request(this.$apis.rechargeOrderPay,data,'post').then(res=>{
							console.log('唤起支付回调',res)
							plus.nativeUI.closeWaiting()
							if(res.status){
								if(payType==1){
									this.payMent(res.data, payType)
								}else{
									this.payMent(res.resultValue, payType)
								}
								
							}else{
								plus.nativeUI.toast(res.statusMessage)	
							}
						})	
					}
					if(this.orderCode){
						subPay(this.orderCode)
					}else{
						let phone = this.telPhone
						phone = phone.replace(/\s*/g,"");
						let data = {
								"guid": this.$getUUid(),
								"mobile": phone,
								"productId": this.productId
						}
						console.log('话费订单入参',data)
										
						this.$util.request(this.$apis.phoneOrderSubmit,data,'POST').then(r=>{
							console.log('提交话费订单', r)
							plus.nativeUI.closeWaiting()
							if (r.status) {
								subPay(r.data.orderId)
							} else {
								plus.nativeUI.toast(r.statusMessage)	
							}
						})
					}
					
				}
				
			},
			payMent(payData, payType) {
				// console.log('payData',payData)
				// console.log('payType',payType)
				plus.nativeUI.showWaiting()
				console.log('payData=',payData)
				if (payType == 0) {
					// 支付宝
					console.log('开始唤起支付',payData)
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: payData, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
						success: (res) => {
							plus.nativeUI.closeWaiting()
							uni.hideLoading()
							this.$toast('支付成功')
							this.$emit('payResult', 1)
						},
						fail: (err) => {
							plus.nativeUI.closeWaiting()
							uni.hideLoading()
							// uni.showToast({
							// 	title: '未完成支付',
							// 	icon: 'error',
							// 	duration: 2500
							// })
							this.$emit('payResult', 0)
						}
					});
				} else {
					// console.log('payData=',payData)
					// return;
					// 微信支付
					uni.requestPayment({
						"provider": "wxpay",
						"orderInfo": {
							"appid": payData.appid, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
							"noncestr": payData.nonce_str, // 随机字符串
							"package": payData.package, // 固定值
							"partnerid": payData.mch_id, // 微信支付商户号
							"prepayid": payData.prepay_id, // 统一下单订单号 
							"timestamp": payData.timestamp, // 时间戳（单位：秒）
							"sign": payData.sign // 签名，这里用的 MD5/RSA 签名
						},
						success: (res) => {
							plus.nativeUI.closeWaiting()
							uni.hideLoading()
							this.$toast('支付成功')
							this.$emit('payResult', 1)
						},
						fail: (e) => {
							plus.nativeUI.closeWaiting()
							uni.hideLoading()
							this.$emit('payResult', 0)
							// uni.showToast({
							// 	title: '未完成支付',
							// 	icon: 'error',
							// 	duration: 2500
							// })
						},
						complete() {
							console.log('结束支付')
							plus.nativeUI.closeWaiting()
							uni.hideLoading()
						}
					})
				}
			},
			successPay(){
				this.$toast('支付成功')
				this.$emit('payResult', 1)
			}
		}
	}
</script>

<style lang="scss">
	.pop_body {
		width: 750rpx;
		height: 374rpx;
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.itm {
			width: 750rpx;
			height: 112rpx;
			border-bottom: 1rpx solid #eee;
			display: flex;
			justify-content: center;

			image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 8rpx;
			}

			view {
				// width: 170rpx;
				font-size: 34rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #000000;
				// text-align: center;
			}
		}

		.cancel_btn {
			width: 750rpx;
			height: 50rpx;
			text-align: center;
			line-height: 120rpx;
			font-size: 34rpx;
		}
	}

	.pop_body1 {
		width: 750rpx;
		height: 747rpx;
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.top-title {
			width: 750rpx;
			height: 110rpx;
			background: #F7F7F9;
			font-size: 34rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			justify-content: space-between;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;

			view {
				margin-left: 35rpx;
			}

			image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 30rpx;
			}
		}

		.parce {
			font-size: 68rpx;
			font-family: DINAlternate-Bold-Regular, DINAlternate-Bold;
			font-weight: 400;
			color: #333333;
			line-height: 70rpx;
			// -webkit-background-clip: text;
			// -webkit-text-fill-color: transparent;
			margin-top: 50rpx;

			view {
				font-size: 55rpx;
				margin-top: 5rpx;
			}
		}
		.time-text{
			font-size: 26rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			.text1{
				color: #FF8327;
				margin: 0 8rpx;
			}
		}
		.select-item{
			width: 690rpx;
			height: 110rpx;
			background: #F4F4F4;
			border-radius: 20rpx;
			margin-top: 56rpx;
			justify-content: space-between;
			.lef{
				margin-left: 30rpx;
				image{
					width: 40rpx;
					height: 40rpx;
				}
				view{
					font-size: 32rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					margin-left: 20rpx;
				}
			}
			.rig{
				width: 34rpx;
				height: 34rpx;
				margin-right: 30rpx;
			}
			
		}
	}
	.payBtn{
		width: 750rpx;
		height: 112rpx;
		background: #FFFFFF;
		box-shadow: 0px -3rpx 6rpx 0px rgba(0,0,0,0.098);
		margin-top: 38rpx;
		justify-content: center;
		view{
			width: 686rpx;
			height: 80rpx;
			background: linear-gradient(to right, #FF4E8C, #F73740);
			border-radius: 46rpx 46rpx 46rpx 46rpx;
			text-align: center;
			line-height: 80rpx;
			color: #fff;
		}
	}
	.time {
	    @include flex;
	    align-items: center;
	
	    &__item {
	         color: #FF8327;
	         font-size: 12px;
	         text-align: center;
	     }
	}
</style>