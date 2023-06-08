<template>
	<view class="content dis cl al_c" style="position: fixed;">
		<u-navbar title="话费充值" bgColor="#F73740" :autoBack="false" :titleStyle="{ color: '#FFF', fontSize: '32rpx' }"
			:placeholder="true" @leftClick="leftBack">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" color="#fff" size="19"></u-icon>
			</view>
		</u-navbar>
		<view class="mask" v-if="showMask&&phoneRechargeLog.length>0">
			<view class="sub-title">历史充值</view>
			<view class="item dis al_c" v-for="(item,index) in phoneRechargeLog" :key="item">
				<view class="number" @touchend.prevent="useNumber(item)">{{item}}</view>
				<image src="/static/icon/close.png" mode="widthFix" @touchend.prevent="delNumber(item)"></image>
			</view>

		</view>
		<view class="body-v">
			<view class="col-1"></view>
			<view :class="['col-20',productList.length>1?'moreHei':'defHei']"></view>
		</view>
		<view class="page-content dis cl al_c">
			<view class="head-v">
				<view class="head">
					<view class="top-title" style="color: #fff;">充值账号（全国通用）</view>
					<view :class="['input',!showMask?'bord':'none']">
						<input type="tel" maxlength="13" @focus="showMask=true" :focus="showMask" @blur="showMask=false"
							v-model="telPhone" placeholder="请输入充值账号" placeholder-class="plac-input"
							@input="handleTelInput">
					</view>
				</view>

				<view class="tips">请确保账号无误，充值成功后不支持退换</view>
				<view class="select-view dis cl al_c" v-if="productList.length>0">
					<scroll-view scroll-y="true" style="width: 100%;height:100%">
						<view :class="['item','dis','al_c',current==index?'actItem':'default']"
							v-for="(item,index) in productList" :key="item.productId" @click="selectItem(index,item)">
							<view class="lef dis al_c">
								<image src="/static/icon/phone-icon.png" mode="widthFix"></image>
								<view class="info dis cl">
									<view class="name">{{item.price}}元</view>
									<view class="price">售价：{{item.discountPrice}}元</view>
								</view>
							</view>
							<view class="rig" v-if="current==index">已选中</view>
							<view class="" v-else> </view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="tips-view">
			<view class="title">温馨提示：</view>
			<view class="text" v-for="(item,index) in usage" :key="item">{{item}}</view>
		</view>
		<view class="bottom-view dis al_c">
			<view class="btn1 dis cl al_c" @click="more">
				<image src="/static/icon/quan-icon.png" mode="widthFix"></image>
				<view class="">更多福利</view>
			</view>
			<view class="btn2 dis cl al_c" @click="toLog">
				<image src="/static/icon/recharge/icon2.png" mode="widthFix"></image>
				<view class="">查询订单</view>
			</view>
			<view class="btn3 dis al_c">
				<view class="lef dis cl">
					<view class="price">￥{{payMoney}}</view>
					<view class="sub-text" v-if="discount>0">已优惠{{discount}}元</view>
				</view>
				<view class="rig" @click="toPay">立即充值</view>
			</view>
		</view>
		<paySelect :showPaySelect="showPaySelect" :telPhone="telPhone" :productId="productId" :orderCode="orderId"
			isRecharge="1" :payMoney="payMoney" @payResult="payResult" @cancelPay="cancelPay">
		</paySelect>
		<u-modal title="提示" content="魔盒用户特权,绑定后开放" :show="isShowmodal" confirmColor="#F44850" :showCancelButton="false"
			@confirm="confirm"></u-modal>
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
				orderId: '',
				showMask: false,
				showPaySelect: false,
				telPhone: '',
				current: 0,
				phoneRechargeLog: [],
				productList: [],
				payMoney: 0.00,
				productId: '',
				usage: '',
				discount: 0.00,
				isShowmodal: false
			};
		},
		onShow() {
			this.current = 0
			plus.nativeUI.closeWaiting()
			uni.hideTabBar()


			this.$util.request(this.$apis.getUserInfo).then(res => {
				console.log('用户信息1', res)
				if (res.status) {
					let phone = res.data.mobile
					phone = this.$insertStr(phone, 3, ' ')
					phone = this.$insertStr(phone, 8, ' ')
					this.telPhone = phone
				}
			})
			if (uni.getStorageSync('userState') != 'BIND_DEVICE') {
				this.isShowmodal = true
				return;
			}
		},
		onUnload() {
			uni.showTabBar()
		},
		watch: {
			showMask(newValue, oldValue) {
				// console.log('new',newValue)
				if (newValue) {
					this.getLogPhone()
				}
			}
		},
		onLoad() {
			this.getLogPhone()
			this.getConfig()

		},
		onReady() {


		},
		mounted() {

		},
		methods: {
			getLogPhone() {
				if (uni.getStorageSync('phoneRechargeLog')) {
					let numberlist = uni.getStorageSync('phoneRechargeLog')
					numberlist = numberlist.length > 3 ? numberlist.splice(numberlist.length - 3, numberlist.length) :
						numberlist
					uni.setStorageSync('phoneRechargeLog=', numberlist)
					this.phoneRechargeLog = numberlist

					// console.log('phoneRechargeLog',this.phoneRechargeLog)
				}
			},
			selectItem(index, item) {
				this.current = index
				this.payMoney = item.discountPrice
				this.discount = (item.price - item.discountPrice) > 0 ? (item.price - item.discountPrice) : 0
			},
			getConfig() {
				this.$util.request(this.$apis.getMetadata).then(r => {
					console.log('话费充值配置', r)
					if (r.status) {
						this.usage = r.data.usage ? r.data.usage.split('\n') : [];
						this.productList = r.data.products
						this.payMoney = this.productList[this.current].discountPrice
						this.productId = this.productList[this.current].productId
						this.discount = (r.data.price - r.data.discountPrice) > 0 ? (r.data.price - r.data
							.discountPrice) : 0
					}
				})
			},
			delNumber(number) {

				let list = this.phoneRechargeLog
				let findIndex = list.indexOf(number)
				// console.log('number=',number)
				console.log('list=', list)
				if (findIndex != -1) {
					console.log('删除一个', findIndex)
					list.splice(findIndex, 1)
				}
				console.log('list=', list)
				this.phoneRechargeLog = list

				uni.setStorageSync('phoneRechargeLog', list)
			},
			useNumber(number) {
				console.log('-------------')
				// let number = '18288888888'
				// number = this.$insertStr(number,3,' ')
				// number = this.$insertStr(number,8,' ')
				this.telPhone = number
				this.showMask = false
			},
			toPay() {
				console.log('唤起支付')
				if (this.telPhone.length != 13) {
					this.$toast('请输入正确的号码')
					return;
				}
				let phone = this.telPhone
				phone = phone.replace(/\s*/g, "");
				if (!this.$checkPhone(phone)) {
					this.$toast('请输入正确的号码')
					return;
				}
				this.payMoney = this.productList[this.current].discountPrice
				this.productId = this.productList[this.current].productId
				this.showPaySelect = true
				let phoneRechargeLog = this.phoneRechargeLog
				if (phoneRechargeLog.indexOf(this.telPhone) == -1) {
					phoneRechargeLog.push(this.telPhone)
					uni.setStorageSync('phoneRechargeLog', phoneRechargeLog)
				}

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
						url: '/pages/order/payState?type=0&from=3'
					})
				} else {
					this.showPaySelect = false
					uni.navigateTo({
						url: '/pages/phoneBill/record'
					})
				}

			},
			cancelPay() {
				this.showPaySelect = false
			},
			change() {

			},
			handleTelInput(e) {
				let value = this.telPhone
				value = value.replace(',', '').replace('*', '').replace('+', '').replace(';', '').replace('#', '')

				var len = value.length
				var reg = new RegExp("\\s", "g");
				var mobile_ = '';
				this.$nextTick(() => {
					this.telPhone = value.replace(reg, "");

					for (var i = 0; i < len; i++) {
						// console.log('len==', len)
						if ((i == 2 && len > 3) || (i == 6 && len > 8)) {
							// charAt(int index)方法是一个能够用来检索特定索引下的字符的String实例的方法。
							//这里用来检索this.telPhone的index为2和6
							mobile_ = mobile_ + this.telPhone.charAt(i) +
								" "; //当检索到2和6时，将原本的mobile_值加上新增的this.telPhone值再加一个" "后再赋值给mobile_自己
						} else {
							mobile_ += this.telPhone.charAt(i);
						}
					}
					mobile_ = mobile_.substring(0, 13)
					this.telPhone = mobile_
				})

			},
			leftBack() {
				if (uni.getStorageSync('lastPage') == 0) {
					uni.switchTab({
						url: '/pages/home/index'
					})
				} else if (uni.getStorageSync('lastPage') == 2) {
					uni.switchTab({
						url: '/pages/shopping/index'
					})
				} else {
					uni.switchTab({
						url: '/pages/my/my'
					})
				}
				uni.showTabBar()
			},
			toLog() {
				uni.navigateTo({
					url: '/pages/phoneBill/record'
				})
			},
			more() {
				uni.navigateTo({
					url: '/pages/phoneBill/index'
				})
			},
			confirm() {
				this.isShowmodal = false;
				uni.switchTab({
					url: '/pages/home/index'
				})
			}

		}

	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: #f0f0f0;
		padding-bottom: 100rpx;

	}

	.body-v {
		.col-1 {
			width: 750rpx;
			height: 200rpx;
			background-color: #F73740;
		}

		.col-20 {
			width: 750rpx;
			background: linear-gradient(to bottom, #F73740, rgba(255, 255, 255, 0));
			// background-image: linear-gradient(to bottom , #7AFFAF, #7A88FF) !important;
		}
		.defHei{
			height: 271rpx;
		}
		.moreHei{
			height: 471rpx;
		}
	}

	.page-content {
		width: 750rpx;
		position: fixed;
		top: 150rpx;
		left: 0;
		z-index: 10;

		.head-v {
			width: 670rpx;
			margin-top: 24rpx;

			.top-title {
				color: #fff;
				font-size: 28rpx;
				opacity: 0.55;
			}

			.bord {
				border-bottom: 1rpx solid #fff;
			}

			.input {
				margin-top: 21rpx;

				input {
					width: 670rpx;
					height: 90rpx;
					line-height: 100rpx;
					font-size: 50rpx;
					font-weight: 600;
					color: #FFFFFF;
					border: none;
				}

				.plac-input {
					font-size: 50rpx;
					font-weight: 600;
					color: #FFFFFF;
					opacity: 0.5;
				}
			}

			.tips {
				font-size: 26rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				margin-top: 18rpx;
			}

			.select-view {
				width: 672rpx;
				max-height: 375rpx;
				background: #FFFFFF;
				border-radius: 12rpx;
				margin-top: 32rpx;
				padding-top: 24rpx;
				overflow: scroll;

				.item {
					width: 625rpx;
					height: 150rpx;
					justify-content: space-between;

					border-radius: 12rpx;

					margin-bottom: 20rpx;
					margin-left: 24rpx;

					.lef {
						image {
							width: 92rpx;
							height: 92rpx;
							background: #FFFFFF;
							margin-left: 26rpx;
							border-radius: 50%;
						}

						.info {
							margin-left: 22rpx;

							.name {
								font-size: 54rpx;
								color: #333333;
								font-weight: bold;
							}

							.price {
								font-size: 26rpx;
								color: #999999;
								// margin-top: -10rpx;
							}
						}
					}

					.rig {
						width: 130rpx;
						height: 58rpx;
						background: rgba(244, 72, 80, 0.1);
						border-radius: 29rpx;
						text-align: center;
						line-height: 58rpx;
						font-size: 26rpx;
						color: #F44850;
						margin-right: 20rpx;
					}
				}

				.actItem {
					background: linear-gradient(to left, rgba(244, 72, 80, 0), rgba(244, 72, 80, 0.12));
					border: 1rpx solid rgba(247, 55, 64, 0.5);
				}

				.default {
					background: linear-gradient(to left, rgba(244, 72, 80, 0), rgba(244, 72, 80, 0.06));
					border: 1rpx solid rgba(255, 255, 255, 0.01);
				}
			}
		}
	}

	.tips-view {
		width: 690rpx;
		margin-top: 30rpx;
		flex-wrap: wrap;

		.title {
			width: 100%;
			font-size: 24rpx;
			color: #666666;
			text-align: left;
			margin-bottom: 16rpx;
		}

		.text {
			font-size: 22rpx;
			color: #333;
			margin-top: 6rpx;
			text-align: left;
		}
	}

	.bottom-view {
		width: 750rpx;
		height: 110rpx;
		background: #FFFFFF;
		box-shadow: 0 -4rpx 10rpx 0 rgba(0, 0, 0, 0.05);
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 90;

		.btn1,
		.btn2 {
			margin-left: 30rpx;

			image {
				width: 52rpx;
				height: 52rpx;
			}

			view {
				font-size: 20rpx;
				color: #F44850;
				margin-top: 4rpx;
			}
		}

		.btn2 {
			view {
				color: #333333;
			}
		}

		.btn3 {
			width: 470rpx;
			height: 95rpx;
			border-radius: 50rpx;
			background-color: #f0f0f0;
			justify-content: space-between;
			margin-left: 24rpx;

			.lef {
				margin-left: 40rpx;

				.price {
					font-size: 40rpx;
					font-family: DINAlternate-Bold-Regular, DINAlternate-Bold;
					font-weight: bold;
					color: #333333;
				}

				.sub-text {
					font-size: 20rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}

			.rig {
				width: 180rpx;
				height: 95rpx;
				background: linear-gradient(270deg, #FF4E8C 0%, #F73740 100%);
				border-top-right-radius: 50rpx;
				border-bottom-right-radius: 50rpx;
				text-align: center;
				line-height: 95rpx;
				font-size: 30rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
	}

	.mask {
		position: fixed;
		width: 100%;
		height: 75vh;
		top: 325rpx;
		left: 0;
		z-index: 90;
		background: rgba(0, 0, 0, 0.8);

		.sub-title {
			font-size: 28rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			margin: 40rpx;
		}

		.item {
			width: 666rpx;
			// height: 100rpx;
			// background-color: #fff;
			justify-content: space-between;
			margin: 0 0 40rpx 40rpx;

			.number {
				font-size: 50rpx;
				font-family: DINAlternate-Bold-Regular, DINAlternate-Bold;
				font-weight: 400;
				color: #FFFFFF;
			}

			image {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>