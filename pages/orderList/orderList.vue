<template>
	<view>
		<headBgImg></headBgImg>
		<view class="content dis cl al_c">

			<u-navbar title="我的订单" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
				
			</u-navbar>
			<view class="tabs">
				<u-tabs :current="current" :list="list1" @click="click" lineColor="#F44850" :activeStyle="{
			    color: '#222222',
			    fontWeight: 'bold',
				fontSize:'36rpx',
			    transform: 'scale(1.05)'
			}" itemStyle="minWidth:55px;height: 44px;fontSize:32rpx;"></u-tabs>
				<!-- <image class="bottom" src="/static/icon/arrow-bottom1.png" mode=""></image> -->
			</view>
			<view class="list dis cl al_c" v-if="orderList.length">
				<scroll-view scroll-y="true" :scroll-top="scrollTop" :show-scrollbar="false" :scroll-with-animation="true"
					:enable-back-to-top="true" style="width:750rpx;height: 82vh;" upper-threshold="50"
					lower-threshold="10" @scrolltolower="tolower" @scroll="scroll">
					<view class="dis cl al_c" style="width: 750rpx;padding-bottom: 50rpx;">
						<view class="card order dis cl al_c" v-for="(item,index) in orderList" :key="item.orderCode"
							@click="toDetail(item)">
							<view class="top dis al_c">
								<view class="t1 dis al_c">
									<image src="/static/icon/order/icon1.png" mode="widthFix" v-if="item.typeId==0">
									</image>
									<image src="/static/icon/order/icon2.png" mode="widthFix" v-if="item.typeId==1">
									</image>
									<image src="/static/icon/order/icon3.png" mode="widthFix" v-if="item.typeId==2">
									</image>
									<image src="/static/icon/order/icon5.png" mode="widthFix" v-if="item.typeId==4">
									</image>
									<image src="/static/icon/order/icon4.png" mode="widthFix" v-if="item.typeId==3">
									</image>
									{{item.typeId==0?'代取快递':item.typeId==1?'代取外卖':item.typeId==2?'代购商品':item.typeId==3?'万能帮':'代寄送'}}
									<view class="t0 dis al_c">详情 <image src="/static/icon/arrow-right2.png" style="width: 25rpx;height: 25rpx;margin:0rpx;padding:0" mode=""></image> </view>
								</view>
								<view class="unPay" v-if="(current==1||current==0)&&(item.replacementStatus==1||item.replacementStatus==3)">
									<text class="t4" style="font-size: 28rpx;color: #99999;">{{item.typeId==4?'快递费':'补单费用'}}</text><text
										class="t2">￥</text><text class="t3">{{item.integer}}</text><text
										class="t2">.{{item.decimal}}</text>
								</view>
								<view :class="[item.orderStatus!=3?'color1':'color2']" v-else>
									{{item.orderStatus==0?'待接单':item.orderStatus==1?'已接单':item.orderStatus==2?'已取货':item.orderStatus==-1?'已取消':'已完成'}}
								</view>
							</view>
							<view class="address1 dis al_c" v-if="item.type!='万能帮'"><text class="point1"></text>
								<image src="/static/logo.png" mode="aspectFill" v-if="item.typeId==0"></image>
								<view class="addr" style="line-height: 48rpx;" v-if="item.typeId!=0"> {{item.pickupAddress}}</view>
								<view class="addr" style="line-height: 48rpx;" v-if="item.typeId==0"> {{item.pickupJson[0].paddress}}</view>
							</view>
							<view class="dis al_c" style="width: 100%;" v-if="item.type!='万能帮'">
								<view class="line" v-if="item.typeId==0" style="height:171rpx;"> </view>
								<view class="line" v-if="item.typeId!=0"> </view>
								<view class="code-info dis al_c" v-if="item.typeId==0">
									<view class="code">取件码1 <text>{{item.pickupJson[0].pcodes[0]}}</text> </view>
									<view class="num dis al_c">共{{item.codeNum}}件 <image src="/static/icon/arrow-right2.png"
											mode="widthFix"></image>
									</view>
									<view class="rig"> </view>
								</view>
							</view>
							<view style="margin-top: 44rpx;" v-if="item.type=='万能帮'"> </view>
							<view class="address2 dis al_c"><text class="point2"></text><text
									class="addr">{{item.receiveAddress}}</text></view>
							<view class="btm dis al_c">
								<view class="time">{{item.orderDate}}</view>
								<view class="btn" @click.stop="showModal(item.orderCode)" v-if="item.orderStatus==0">取消
								</view>
								<view class="pay_btn" v-if="(current==1||current==0)&&(item.replacementStatus==1||item.replacementStatus==3)"
									@click.stop="showPayPopup(item.orderCode,item.replacementMoney)">去支付</view>
							</view>
						</view>
						<view style="margin-top: 50rpx;">
							<u-loadmore loadmoreText="暂无更多订单数据" dashed line />
						</view>
					</view>
				</scroll-view>


			</view>
			<view class="no_data dis cl al_c" v-if="!orderList.length">
				<image src="/static/icon/noAddress.png" mode="widthFix"></image>
				<view>暂无订单</view>
			</view>
		</view>
		<paySelect :showPaySelect="showPaySelect" :payMoney="payMoney" isRecharge="0" :orderCode="orderId" @payResult="payResult" @cancelPay="cancelPay">
		</paySelect>
		<u-modal :title="modalText" :show="isShowModal" confirmColor="#F44850" :showCancelButton="true"
			@cancel="isShowModal=false" @confirm="confirmModal"></u-modal>
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
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				showPaySelect: false,
				payMoney:0,
				isShowModal: false,
				modalText: '是否确认取消订单？',
				triggered: false,
				config: {
					back: false,
					title: '我的订单',
					backgroundColor: [0, '#F0F0F0'],
					fontSize: '16px',
					color: '#0C0C0C'
				},
				list1: [{
						name: '全部',
					},
					{
						name: '待支付'
					},
					{
						name: '待接单',
					},
					{
						name: '服务中'
					},
					{
						name: '已完成'
					},
					{
						name: '退款/售后'
					}
				],
				orderList: [],
				current: 0,
				orderId: '',
				pageIndex: 1,
				pageSize: 10

			};
		},
		onLoad(opt) {
			if(opt.index){
				this.current = opt.index
			}
			this._freshing = false;
			setTimeout(() => {
				this.triggered = true;
			}, 1000)
		},
		onShow() {
			this.getData(this.list1[this.current].name, this.pageIndex)
		},

		methods: {
			showModal(id) {
				this.orderId = id
				this.isShowModal = true
			},
			confirmModal() {
				this.isShowModal = false
				this.cancelOrder()
			},
			showPayPopup(id,payMoney) {
				this.orderId = id
				console.log('payMoney=',payMoney)
				this.payMoney = payMoney
				this.showPaySelect = true
			},
			// 支付结果
			payResult(e) {
				console.log('支付回调结果', e)
				if (e == 1) {
					this.showPaySelect = false
					this.getData(this.list1[this.current].name, this.pageIndex)
				} else {
					this.showPaySelect = false
				}
			},
			cancelPay() {
				this.showPaySelect = false
			},
			cancelOrder() {
				let data = {
					orderCode: this.orderId
				}
				this.$util.request(this.$apis.cancelOrder, data).then(r => {
					console.log('取消订单', r)
					if (r.status) {
						plus.nativeUI.toast('已取消订单')
						this.getData(this.list1[this.current].name, this.pageIndex)
					} else {
						this.$toast(r.statusMessage)
					}
				})
			},
			tolower() {
				console.log('bottom')
				this.getData(this.list1[this.current].name, this.pageIndex + 1)
			},
			getData(type, pageIndex) {
				let data = {
					type: type,
					pageIndex: pageIndex,
					pageSize: this.pageSize
				}
				// console.log('订单列表入参', data)
				plus.nativeUI.showWaiting('加载中..')
				this.$util.request(this.$apis.getUserOrderList, data).then(r => {
					// console.log('订单列表', r)
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 300)
					if (r.status) {
						let list = r.data
						if (list) {
							
							list.forEach(item => {
								item['integer'] = this.$getBit(item.replacementMoney).integer
								item['decimal'] = this.$getBit(item.replacementMoney).decimal
								item['codeNum'] = 0
								if(item.pickupJson){
									item.pickupJson.forEach(son=>{
										if(son.pcodes){
											son['pcodes'] = son.pcodes.split(',')
											item.codeNum += son.pcodes.length
										}else{
											son['pcodes'] = ['0000']
											item.codeNum += son.pcodes.length
										}
										
									})
									
								}else{
									item['pickupJson'] = [{adress:'',pcodes:['0000']}]
									item.codeNum = 1
								}
							})
						}
						if (pageIndex == 1) {
							this.orderList = list ? list : []
						} else if (pageIndex > this.pageIndex && list.length) {
							console.log('追加数据', list)
							this.orderList = this.orderList.concat(list ? list : [])
							this.pageIndex = pageIndex
						}
						console.log('list=',this.orderList)
						setTimeout(() => {
							plus.nativeUI.closeWaiting()
						}, 300)
					} else {
						plus.nativeUI.closeWaiting()
					}
				})
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			click(e) {
				console.log(e)
				this.current = e.index
				this.pageIndex = 1
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				this.getData(e.name, this.pageIndex)
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/orderList/detail?orderCode=' + item.orderCode
				})
			},
			onPulling(e) {
				console.log("onpulling", e);
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				this.pageIndex = 1
				this.getData(this.list1[this.current].name, this.pageIndex)
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 3000)
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
				console.log("onRestore");
			},
			onAbort() {
				console.log("onAbort");
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		background-color: #f0f0f0;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
	}

	.no_data {
		width: 750rpx;
		margin-top: 300rpx;

		image {
			width: 407rpx;
			height: 238rpx;

		}

		view {
			font-size: 28rpx;
			color: #333;
			margin-top: 16rpx;
		}
	}

	.tabs {
		width: 750rpx;
		padding: 20rpx 0 0 0;
		// background-color: #fff;
	}

	.tabs {
		position: fixed;
		left: 0;
		top: 150rpx;

		// z-index: 99;
		.bottom {}
	}

	.list {
		width: 750rpx;
		margin-top: 120rpx;
	}

	.card {
		width: 686rpx;
		// height: 450rpx;
		background-color: #fff;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.order {
		// margin-top: 20rpx;

		.top {
			width: 638rpx;
			height: 97rpx;
			justify-content: space-between;
			border-bottom: 1rpx solid #eee;

			// margin-top: 27rpx;
			image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 18rpx;
			}

			.t1 {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
			}
			.t0{
				font-size: 28rpx;
				margin-left: 16rpx;
				color: #999999;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
			}

		}

		.color1 {
			color: #F44850;
			font-size: 32rpx;
		}

		.color2 {
			color: #999999;
			font-size: 32rpx;
		}

		.line {
			width: 0rpx;
			height: 46rpx;
			border-right: 4rpx solid #EEEEEE;
			margin-left: 30rpx;
			margin-top: -10rpx;
		}

		.address1 {
			width: 638rpx;
			font-size: 28rpx;
			margin-top: 32rpx;

			image {
				width: 48rpx;
				height: 48rpx;
				border-radius: 12rpx;
				margin-right: 12rpx;
			}

			.addr {
				width: 500rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; // 作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 1; // 显示的行
				line-height: 48rpx;


			}
		}

		.address2 {
			width: 638rpx;
			font-size: 28rpx;
			margin-top: -10rpx;

			.addr {
				width: 500rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; // 作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 1; // 显示的行
			}
		}

	}

	.btm {
		width: 638rpx;
		height: 100rpx;
		// border-top: 1rpx solid #eee;
		margin-top: 30rpx;
		justify-content: space-between;

		.time {
			font-size: 26rpx;
			color: #999;
		}

		.btn {
			width: 160rpx;
			height: 64rpx;
			background: #FFFFFF;
			border-radius: 32rpx 32rpx 32rpx 32rpx;
			border: 2rpx solid #999999;
			text-align: center;
			line-height: 64rpx;
			font-size: 26rpx;
			color: #666666;
		}
	}

	.point1,
	.point2 {
		width: 16rpx;
		height: 16rpx;
		margin-right: 16rpx;
		display: block;
		border-radius: 50%;
	}

	.point1 {
		background-color: #F44850;

	}

	.point2 {
		background-color: #2E6EEF;

	}

	.unPay {
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;

		.t4 {
			color: #999999;
			font-size: 26rpx;
		}

		.t2 {
			color: #F44850;
			font-size: 28rpx;
		}

		.t3 {
			color: #F44850;
			font-size: 48rpx;
		}
	}

	.pay_btn {
		width: 160rpx;
		height: 64rpx;
		text-align: center;
		line-height: 64rpx;
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
		border: none;
		font-size: 28rpx;
		border-radius: 32rpx;
	}

	.code-info {
		margin-left: 36rpx;

		.code {
			width: 472rpx;
			height: 80rpx;
			line-height: 80rpx;
			// background: #F8F8F8;
			background-image: linear-gradient(to right, rgb(248, 248, 248), rgb(248, 248, 248) 80%, transparent);
			border-radius: 8rpx;
			padding-left: 16rpx;
			font-size: 32rpx;
			color: #666666;

			text {
				font-size: 32rpx;
				font-family: PingFang SC-中黑体, PingFang SC;
				font-weight: normal;
				color: #333333;
				margin-left: 43rpx;
			}

			.rig {
				display: flex;
				justify-content: flex-end;
				width: 50rpx;
				height: 80rpx;
				background: #F8F8F8;
				// background-image: linear-gradient(to right,rgb(248,248,248),transparent);
			}
		}

		.num {
			font-size: 24rpx;
			font-family: PingFang SC-常规体, PingFang SC;
			font-weight: normal;
			color: #999999;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-left: 12rpx;
			}
		}

	}

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
</style>
