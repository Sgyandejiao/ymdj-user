<template>
	<view class="content dis cl al_c">
		<view class="top-tips" @click="callPhone">如果您对记录有任何疑问,请联系客服4000251117</view>
		<view class="list dis cl al_c">
			<view class="item dis cl " v-for="(item,index) in list" :key="item.id">
				<view class="top dis al_c">
					<view class="time">下单时间：{{item.createOn}}</view>
					<view :class="['state',(item.orderStatus==0||item.orderStatus==1)?'red':'']">
						{{item.orderStatus==0?'待付款':item.orderStatus==1?'充值中':item.orderStatus==2?'充值成功':item.orderStatus==-1?'已取消':'交易关闭'}}
					</view>
				</view>
				<view class="content dis cl ">
					<view class="itm dis al_c">
						<view class="label">订单编号</view>
						<view class="value dis al_c">{{item.orderCode}}
							<view class="copy" @click="copyText(item.orderCode)">复制</view>
						</view>
					</view>
					<view class="itm dis al_c">
						<view class="label">商品名称</view>
						<view class="value">{{item.goodsName}}</view>
					</view>
					<view class="itm dis al_c">
						<view class="label">充值号码</view>
						<view class="value">{{item.rechargeMobile}}</view>
					</view>
					<view class="itm dis al_c">
						<view class="label">充值金额</view>
						<view class="value">￥{{item.rechargeMoney}}</view>
					</view>
					<view class="itm dis al_c">
						<view class="label">支付方式</view>
						<view class="value">{{item.payType==0?'支付宝':'微信'}}</view>
					</view>
				</view>
				<view class="count dis">
					<view class="lef-text" style="color:#F73741 ;" v-if="item.orderStatus>2">款项已原路返还</view>
					<view class="lef-text" style="color:#F73741 ;" v-else> </view>
					<view class="money dis al_c">
						<view class="t1">总计</view>
						<view class="t2">￥</view>{{item.payMoney}}
					</view>
				</view>
				<view class="btn dis al_c" v-if="item.orderStatus==0">
					<view class="btn1" @click="toCancelOrder(item.orderCode)">取消订单</view>
					<view class="btn2 dis al_c" @click="toPay(item)" style="color: #fff;" v-if="item.leave>0">支付 <u-count-down
							:time="item.leave" format="mm:ss" @finish="finish(item)"></u-count-down>
					</view>

				</view>
			</view>
		</view>
		<paySelect :showPaySelect="showPaySelect" :telPhone="telPhone" :productId="productId" :orderCode="orderId"
			isRecharge="1" :payMoney="payMoney" @payResult="payResult" @cancelPay="cancelPay">
		</paySelect>
		<u-modal title="是否确认取消订单" :show="isShowModal" confirmColor="#F44850" :showCancelButton="true"
			@cancel="isShowModal=false" @confirm="cancelOrder"></u-modal>
	</view>
</template>

<script>
	import paySelect from '@/components/paySelect.vue'
	export default {
		components: {
			paySelect
		},
		data() {
			return {
				list: [],
				pageIndex: 1,
				showPaySelect: false,
				telPhone: '',
				productId: '',
				orderId: '',
				payMoney: 0,
				isShowModal: false
			}
		},
		onLoad() {
			this.getData(this.pageIndex)
		},
		onReachBottom() {
			this.getData(this.pageIndex + 1)
		},
		methods: {
			toPay(item) {
				console.log(item)
				this.orderId = item.orderCode
				this.payMoney = item.payMoney
				this.showPaySelect = true
			},
			// 支付结果
			payResult(e) {
				console.log('支付回调结果', e)
				if (e == 1) {
					this.showPaySelect = false
					// 充值后存储到历史账号
					let phoneRechargeLog = []
					if (uni.getStorageSync('phoneRechargeLog')) {
						phoneRechargeLog = uni.getStorageSync('phoneRechargeLog')
						if (phoneRechargeLog.indexOf(this.telPhone) == -1) {
							phoneRechargeLog.push(this.telPhone)
							uni.setStorageSync('phoneRechargeLog', phoneRechargeLog)
						}

					}
					uni.navigateTo({
						url: '/pages/order/payState?type=0&from=1'
					})
				} else {
					this.showPaySelect = false

					this.$toast('未完成支付')
				}

			},
			cancelPay() {
				this.showPaySelect = false
			},
			toCancelOrder(orderCode) {
				this.orderCode = orderCode
				this.isShowModal = true
			},
			cancelOrder() {
				let data = {
					orderId: this.orderCode
				}
				this.$util.request(this.$apis.rechargeCancleOrder, data, 'post').then(r => {
					if (r.status) {
						this.$toast('已取消订单')
						this.isShowModal = false
						this.pageIndex = 1
						this.getData(this.pageIndex)
					} else {
						this.$toast(r.statusMessage)
					}
				})
			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: '4000251117'
				})
			},
			getData(pageIndex) {
				let data = {
					pageIndex,
					pageSize: 10,
				}
				console.log('data', data)
				plus.nativeUI.showWaiting()
				this.$util.request(this.$apis.getRechargeOrderList, data, 'post').then(r => {
					console.log('话费充值记录', r)
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 200)
					if (r.status) {
						r.data = r.data ? r.data : [];
						r.data.forEach(item => {
							item.rechargeMoney = this.$toFixed(item.rechargeMoney)
							item.payMoney = this.$toFixed(item.payMoney)
							let date = new Date(item.createOn)

							item['leave'] = (Number(date.getTime()) + 1000 * 60 * 5) - Number(Date.now())
						})
						console.log(r.data)
						if (pageIndex == 1) {
							this.list = r.data
						} else if (pageIndex > this.pageIndex) {
							this.list = this.list.concat(r.data)
							this.pageIndex = pageIndex
						}
					} else {
						this.$toast(r.statusMessage)
					}
				})
			},
			copyText(text) {
				uni.setClipboardData({
					data: text
				})
			},
			finish(item) {
				var checkAtTime = (beginTime) => {
					let todayDate = new Date().setHours(0, 0, 0, 0); //把今天的日期时分秒设置为00：00：00，返回一个时间戳, 
					// todayDate就是今天00：00：00时刻的时间戳

					let paramsDate = new Date(beginTime).setHours(0, 0, 0, 0); //给new Date()传入时间，并返回传入时间的时间戳

					let isToday = (todayDate === paramsDate); //时间戳相同时 True 就为今天 
					return isToday;

				}
				let timeArr = item.createOn.split('-');
				let isAtTime = checkAtTime(timeArr[0]); // 是否当日
				if (isAtTime) {
					console.log('当日订单')
					this.pageIndex = 1
					this.getData(this.pageIndex)
				} else {
					console.log('非当日订单')
				}

			}
		}
	}
</script>

<style lang="scss">
	@import '~@/common/scss/mixins.scss';

	page {
		width: 750rpx;
		background-color: #F0F0F0;
	}

	.tips {
		width: 686rpx;
		margin: 24rpx 0;

		image {
			@include setBox(32rpx, 32rpx);
		}

		view {
			@include setFont(24rpx, #666);
			margin-left: 16rpx;
		}
	}

	.list {
		width: 710rpx;
		margin-top: 20rpx;

		.item {
			width: 710rpx;

			// @include setBox(710rpx, 610rpx);
			border-radius: 12rpx;
			background-color: #fff;
			margin-bottom: 20rpx;

			.top {
				@include setBox(662rpx, 100rpx);
				border-bottom: 1rpx solid #EEEEEE;
				justify-content: space-between;
				margin-left: 24rpx;

				.time {
					@include setFont(30rpx, #333);
				}

				.state {
					font-size: 30rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
				}

				.red {
					color: #FD5548;
				}
			}

			.content {
				width: 710rpx;
				margin-top: 15rpx;

				.itm {
					width: 662rpx;
					margin-bottom: 24rpx;
					justify-content: space-between;
					margin-left: 24rpx;

					.label {
						@include setFont(28rpx, #333);
					}

					.value {
						@include setFont(28rpx, #333);

						.copy {
							@include setBox(56rpx, 30rpx);
							background: #FFFFFF;
							border-radius: 15rpx;
							border: 1px solid #2E6EEF;
							text-align: center;
							line-height: 30rpx;
							@include setFont(22rpx, #2E6EEF);
							margin-left: 20rpx;
						}
					}


				}
			}

			.count {
				display: flex;
				flex-direction: row;
				width: 686rpx;
				justify-content: space-between;
				margin-bottom: 10rpx;

				.lef-text {
					font-size: 26rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #F73741;
					margin: 24rpx 0 0 24rpx;
				}

				.money {
					// align-items: flex-end;
					@include setFont(50rpx, #333);

					// margin-right: 26rpx;
					view {
						@include setFont(26rpx, #333);
					}

					.t1 {
						font-size: 26rpx;
						margin-top: 10rpx;
					}

					.t2 {
						font-size: 34rpx;
						font-weight: 550;
					}
				}
			}

			.btn {
				width: 662rpx;
				height: 100rpx;
				border-top: 1rpx solid #eee;
				justify-content: flex-end;
				margin-top: 18rpx;
				margin-left: 24rpx;

				view {}

				.btn1 {
					@include setFont(30rpx, #666);
					border: 1rpx solid #979797;
					@include setBox(200rpx, 68rpx);
					text-align: center;
					line-height: 68rpx;
					border-radius: 50rpx;
				}

				.btn2 {
					background-color: #F73741;
					@include setFont(30rpx, #fff);
					margin-left: 12rpx;
					@include setBox(200rpx, 68rpx);
					text-align: center;
					line-height: 68rpx;
					border-radius: 50rpx;
					color: #fff;
					justify-content: center;

					view,
					text {
						color: #fff;
					}
				}
			}
		}
	}

	.top-tips {
		width: 750rpx;
		height: 80rpx;
		text-align: center;
		line-height: 120rpx;
		font-size: 28rpx;
		color: #999;
	}
</style>