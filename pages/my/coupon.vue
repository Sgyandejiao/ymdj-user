<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar :title="navTitle" bgColor="rgba(0,0,0,0)" :placeholder="true" :autoBack="true">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon/arrow-left.png" mode="widthFix"></image>
			</view>
		</u-navbar>
		<view style="width: 750rpx;">
			<u-tabs :list="navList" @click="click"
				itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;width:310rpx;" lineColor="#F44850"
				:activeStyle="{
            color: '#303133',
            fontWeight: 'bold',
            transform: 'scale(1.05)'}" v-if="from==1">

			</u-tabs>
			<scroll-view scroll-y="true" style="height: 85vh;margin-top:20rpx;">
				<view class="dis cl al_c" style="width: 750rpx;padding:0 0 160rpx 0;">
					<view class="list dis cl al_c">
						<view class="item" v-for="(item,index) in list" :key="item.couponId"
							@click.stop="selectTap(index,item)">
							<image class="bg_image" src="/static/images/coupon_bg1.png" mode="widthFix"
								v-if="item.isSelect&&from!=1"></image>
							<image class="bg_image" src="/static/images//coupon_bg2.png" mode="widthFix" v-else>
							</image>
							<view class="info dis al_c">
								<view class="price" v-if="current==0"><text>￥</text>{{item.couponMoney}}
								</view>
								<view class="price" style="color:#999999 ;" v-if="current==1">
									<text>￥</text>{{item.couponMoney}}
								</view>
								<view class="text">
									<view class="t1" v-if="current==0">{{item.couponType==0?'跑腿优惠券':'其他优惠券'}}
									</view>
									<view class="t1" style="color:#999999 " v-if="current==1">
										{{item.couponType==0?'跑腿优惠券':'其他优惠券'}}
									</view>
									<view class="t1" style="color:#999999;font-size: 24rpx;">
										{{item.couponFrom}}
									</view>
									<view class="t2">有效期 {{item.validDate}}</view>
								</view>
								<view class="btn" v-if="current==1&&item.couponStatus!=-1&&from==1">
									{{item.couponStatus==1?'已使用':item.couponStatus==0?'已过期':'已失效'}}
								</view>
								<view class="btn1 dis al_c" @click="showTips(item.couponRecycleDesc)"
									v-if="item.couponStatus==-1&&from==1">
									已回收 <image src="/static/icon/wenhao.png" mode="widthFix"></image>
								</view>
								<!-- <image class="select" src="/static/icon/success.png" mode="widthFix"
							v-if="item.isSelect&&from!=1"></image> -->

							</view>
						</view>
					</view>
					
					<view class="no_data" v-if="!list.length">暂无优惠券</view>
				</view>
			</scroll-view>
			<view class="btn-view" v-if="from==0">
				<view class="bottom-btn confirm" @click="back" v-if="from==0">确定</view>
			</view>
			
		</view>
		<u-popup :show="isTips" :round="20" mode="center">
			<view class="popup-tips dis cl al_c" style="height: 330rpx;">
				<view class="title">{{tips.title}}</view>
				<view class="bottom dis al_c">
					<view class="rig btn" @click="isTips=false">了解了</view>
				</view>
			</view>
		</u-popup>
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
				navTitle:'优惠券',
				tips: {
					title: '',
				},
				isTips: false,
				current: 0,
				navList: [{
						name: '可用'
					},
					{
						name: '失效'
					}
				],
				list: [],
				from: 0,
				selectIds: [],
				orderPrice: 0,
				orderCoupon: [],
				sumPrice: 0
			};
		},
		onLoad(opt) {
			if (opt?.from == 1) {
				this.from = 1
			}else{
				this.navTitle = '选择优惠券'
			}
			if (opt?.orderPrice) {
				this.selectIds = JSON.parse(opt.couponList)
				console.log('selectIds=', this.selectIds)
				this.orderPrice = opt.orderPrice
			}
			this.getData()
		},
		created() {

		},
		onReady() {


		},
		mounted() {

		},
		onUnload() {
			if (this.from == 0) {
				console.log('selectIds=', this.selectIds)
				console.log('sumPrice=', this.sumPrice)
				uni.setStorageSync('couponList', this.selectIds)
				uni.setStorageSync('couponSumprice', this.sumPrice)

			}
		},
		methods: {
			back(){
				if (this.from == 0) {
					console.log('selectIds=', this.selectIds)
					console.log('sumPrice=', this.sumPrice)
					uni.setStorageSync('couponList', this.selectIds)
					uni.setStorageSync('couponSumprice', this.sumPrice)
					uni.navigateBack()
				}
			},
			showTips(text) {
				let tips = this.tips
				tips.title = text ? text : '您有一个淘宝（京东、拼多多）的订单取消，系统将回收赠送的跑腿优惠券'
				this.tips = tips
				this.isTips = true
			},
			getData() {
				plus.nativeUI.showWaiting('加载中...')
				let data = {
					type: this.current
				}
				console.log('data=', data)
				this.$util.request(this.$apis.getCouponList, data).then(r => {
					console.log('我的优惠券', r)
					
					if (r.status) {
						let list = r.data ? r.data : []
						let sumPrice = this.sumPrice
						console.log('orderCoupon', this.orderCoupon)
						for (let itm of list) {
							if (JSON.stringify(this.selectIds).indexOf(itm.couponId) != -1) {
								itm['isSelect'] = true
								sumPrice += itm.couponMoney
							} else {
								itm['isSelect'] = false
							}
						}
						this.sumPrice = sumPrice

						this.list = list
					} else {
						this.$toast(r.statusMessage, 'error')
					}
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 300)
				})
			},
			selectTap(index, item) {
				if (this.from == 1 || item.couponStatus != 0) {
					return;
				}
				if (!item.isSelect) { // 选中
					this.selectIds.push(item.couponId)
					console.log('selectIds=', this.selectIds)

					let orderPrice = Number(this.orderPrice)
					let sumPrice = 0
					this.selectIds.forEach(item => {
						this.list.forEach(son => {
							if (item == son.couponId) {
								sumPrice = sumPrice + Number(son.couponMoney)
							}
						})
					})
					console.log('已选中优惠金额sumPrice=', sumPrice)
					console.log('订单总金额orderPrice=', orderPrice)
					
					if (sumPrice > orderPrice) {
						this.$toast('优惠总金额不能超过订单金额')
						this.selectIds.splice(this.selectIds.length - 1, 1)
						let sumPrice = 0
						this.selectIds.forEach(item => {
							this.list.forEach(son => {
								if (item == son.couponId) {
									sumPrice = sumPrice + Number(son.couponMoney)
								}
							})
						})


						this.sumPrice = sumPrice
						return;
					} else {
						this.sumPrice = sumPrice
					}


				} else { // 取消


					let selectIds = JSON.parse(JSON.stringify(this.selectIds))
					let findIndex = selectIds.findIndex((itm, index) => {
						return itm == item.couponId
					})
					console.log('findIndex=', findIndex)
					console.log('befor-selectIds=', selectIds)
					selectIds.splice(findIndex, 1)
					console.log('after-selectIds=', selectIds)

					this.selectIds = selectIds
					console.log('this-selectIds=', selectIds)
					let orderPrice = Number(this.orderPrice)
					let sumPrice = 0
					this.selectIds.forEach(item => {
						this.list.forEach(son => {
							if (item == son.couponId) {
								sumPrice = sumPrice + Number(son.couponMoney)
							}
						})
					})
					// console.log('sumPrice=', sumPrice)
					this.sumPrice = sumPrice
				}

				// 反选操作 （取消：先反选再判断）
				let list = this.list
				list[index].isSelect = !list[index].isSelect
				this.list = list



			},
			select(item) {
				if (item.couponStatus == 0 && this.from != 1) {
					uni.setStorageSync('coupon', item)
					uni.navigateBack()
				}
			},
			click(e) {
				console.log(e)
				this.current = e.index
				this.list = []
				this.getData()
			}
		}

	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;
		// padding-bottom: 100rpx;
	}

	.list {
		width: 750rpx;
		// margin-top: 50rpx;

		.item {
			position: relative;
			width: 686rpx;
			height: 160rpx;
			margin-bottom: 16rpx;

			.bg_image {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 10;
			}

			.info {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 20;

				.price {
					font-size: 56rpx;
					font-family: DIN Alternate-Bold, DIN Alternate;
					font-weight: bold;
					color: #F44850;
					line-height: 0px;
					margin-left: 54rpx;

					text {
						font-size: 36rpx;
					}
				}

				.text {
					margin-left: 99rpx;

					.t1 {
						font-size: 28rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}

					.t2 {
						font-size: 24rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						color: #999999;
						margin-top: 8rpx;
					}
				}

				.btn,
				.btn1 {
					position: absolute;
					z-index: 99;
					width: 144rpx;
					height: 60rpx;
					right: 24rpx;
					justify-content: center;
					background: #E4E5E6;
					border-radius: 8rpx;
					opacity: 1;
					text-align: center;
					line-height: 60rpx;
					font-size: 28rpx;
					color: #999999;
					margin-left: 71rpx;
				}

				.btn1 {
					width: 152rpx;

					image {
						width: 25rpx;
						height: 25rpx;
						margin-left: 6rpx;
					}
				}

				.select {
					width: 60rpx;
					height: 60rpx;
					margin-left: 71rpx;
				}
			}
		}
	}

	.bottom-btn {
		width: 686rpx;
		height: 88rpx;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		font-size: 28rpx;
		text-align: center;
		line-height: 88rpx;
		position: fixed;
		bottom: 50rpx;
		left: 32rpx;

	}

	.confirm {
		background: linear-gradient(90deg, #FF4E8C 0%, #F73740 100%);
		color: #fff;
	}

	.no_data {
		width: 750rpx;
		text-align: center;
		color: #666;
		font-size: 28rpx;
		margin-top: 350rpx;
	}
	.btn-view{
		width: 750rpx;
		height: 160rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		background-color: #f0f0f0;
	}
</style>