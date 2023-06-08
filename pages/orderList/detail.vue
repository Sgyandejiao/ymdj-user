<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="" :placeholder="true" bgColor="rgba(0,0,0,0)" :autoBack="true">
			<view class="u-nav-slot" slot="left">
				<image src="/static/icon/arrow-left.png" style="width: 48rpx;height: 48rpx;" mode="widthFix"></image>
				<view class="u-nav-back-text">{{navTitle}}<text v-if="detail.replacementStatus==1||detail.replacementStatus==3">￥{{detail.replacementMoney}}</text></view>
			</view>
		</u-navbar>
		<scroll-view scroll-y="true" style="width: 750rpx;height:90vh;">
			<view class="dis cl al_c" style="padding-bottom: 150rpx;">
				<view class="steps dis  al_c" v-if="current!=0&&detail.orderStatus!=-1">
					<u-steps :current="current" v-if="detail.orderStatus!=-1">
						<u-steps-item title="已接单" :desc="detail.handleOrderDate"></u-steps-item>
						<u-steps-item title="已取货" :desc="detail.pickupOrderDate"></u-steps-item>
						<u-steps-item title="已完成" :desc="detail.completeDate"></u-steps-item>
					</u-steps>
					<u-steps :current="current1" v-else>
						<u-steps-item title="已取消"></u-steps-item>
						<u-steps-item :title="current1==2?'已退款':'待退款'"></u-steps-item>
					</u-steps>
					<view class="detail_text dis al_c" v-if="detail.orderStatus!=-1">
						<view class="color1" @click="seeStep(0)">详情</view>
						<view :class="[current>1?'color1':'color2']" @click="seeStep(1)">详情</view>
						<view :class="[current==3?'color1':'color2']" @click="seeStep(2)">详情</view>
					</view>
				</view>
				<view class="top-text" v-if="detail.orderStatus==-1">
					<view class="tex1">取消原因：<text>{{detail.orderCancelDesc=='用户自主取消'?'主动取消订单':'超时自动取消' || '主动取消订单'}}</text></view>
					<view class="tex2">取消时间：<text>{{detail.orderCancelDate || '--'}}</text></view>
				</view>
				<view class="page_v dis cl al_c">
					<view class="card dis cl al_c">
						<view class="top_title dis al_c">
							<view class="t1">{{detail.orderTypeId==4?'代寄送':detail.orderType}}</view>
							<view class="t2"><text class="t3">￥</text><text class="t4">{{detail.integer}}</text>.<text
									class="t3">{{detail.decimal}}</text></view>
						</view>

						<block v-if="detail.orderTypeId==0">
							<view class="code_list" :style="codeOpen?openHeight:codeSum==1?miniHeight: (codeList.length==2&&codeSum==2)?defaultHeight:closeHeight">
								<view class="item dis cl al_c" v-for="(item,index) in codeList" :key="item.id"
									v-if="item['codeList']&&item['codeList'].length">
									<view class="top-view dis al_c">
										<view class="top1 dis al_c">
											<image src="/static/logo.png" mode="widthFix"></image>
											<view>{{item.address}}{{item.addressType}}</view>
										</view>
									</view>
									<view class="code_v dis al_c" v-for="(son,sonIndex) in item['codeList']">
										<view class="lef dis al_c">取件码{{sonIndex+1}}
											<text>{{son['code'+index+sonIndex]}}</text>
										</view>

									</view>
								</view>

							</view>
							<view class="open-icon dis j_c" v-if="codeSum>2" @click="codeOpen=!codeOpen">
								<view class="btm dis j_c al_c">
									<view>共{{codeSum}}件</view>
									<image class="btm_open" src="/static/icon/arrow-bottom1.png" mode="widthFix"
										 v-if="!codeOpen"></image>
									<image class="btm_open" style="transform: rotateZ(-180deg);"
										src="/static/icon/arrow-bottom1.png" mode="widthFix" 
										v-else>
									</image>
								</view>
							</view>
						</block>
						<block v-if="detail.orderTypeId!=0">
							<view class="content_text" v-if="detail.orderDesc">{{detail.orderDesc}}</view>
							<view class="img_v dis al_c" v-if="detail.imgList">
								<image :src="item" v-for="(item,index) in detail.imgList" :key="item"
									@click="preView(index)">
								</image>
				 			</view>
						</block>
					</view>

					<view class="card dis cl al_c">
						<view class="item dis al_c" v-if="detail.orderTypeId!=3&&detail.orderTypeId!=0">
							<view class="title">取货地址</view>
							<view class="value">{{detail.pickupAddress}}</view>
						</view>
						<view class="item add1  dis al_c">
							<view class="title">
								{{detail.orderTypeId==3?'服务地址':detail.orderTypeId==4?'收件地址':'送达地址'}}
							</view>
							<!-- <view class="value" style="width: 400rpx;">{{detail.receiveAddress}}</view> -->
							<view class="dis">
								<view class="value ">{{detail.receiveAddress}}</view>
								<!-- <view class="copy" >复制</view> -->
							</view>

						</view>

						<view class="item dis al_c" style="margin-bottom: 0;">
							<view class="title">联系电话</view>
							<view class="value">{{detail.linKMobileText}}</view>
						</view>
					</view>

					<view class="card dis cl al_c">
						<view class="item dis al_c">
							<view class="title">订单编号</view>
							<view class="dis al_c">
								<view class="value">{{detail.orderCode}}</view>
								<view class="copy" style="color:#2E6EEF ;" @click="copyText(detail.orderCode)">复制</view>
							</view>
						</view>
						<view class="item dis al_c">
							<view class="title">订单类型</view>
							<view class="value">{{detail.orderTypeId==4?'代寄送':detail.orderType}}</view>
						</view>
						<view class="item dis al_c" v-if="detail.orderTypeId!=2&&detail.orderTypeId!=3">
							<view class="title">物品数量</view>
							<view class="value">{{detail.quantity}}</view>
						</view>
						<view class="item dis al_c" v-if="detail.orderTypeId!=2&&detail.orderTypeId!=3">
							<view class="title">物品重量</view>
							<view class="value">{{detail.weightDesc}}公斤</view>
						</view>
						<view class="item dis al_c" >
							<view class="title">下单时间</view>
							<view class="value">{{detail.orderDate}}</view>
						</view>
						<view class="item dis al_c" style="margin-bottom: 0;">
							<view class="title">上门时间</view>
							<view class="value">{{detail.isOtherday==0?'当天':'隔天'}}</view>
						</view>
					</view>

					<view class="card dis cl al_c">
						<view class="item dis al_c">
							<view class="title">订单金额</view>
							<view class="value">￥{{Number(detail.orderMoney).toFixed(2)}}</view>
						</view>
						<view class="item dis al_c" v-if="detail.orderTypeId==0||detail.orderTypeId==1">
							<view class="title">优惠卡券</view>
							<view class="value">
								<view v-if="!detail.couponMoney">未使用卡券</view>
								<view v-if="detail.couponMoney>0" style="color:#F44850 ;">{{detail.couponMoney+'元跑腿券'}}
								</view>
							</view>
						</view>
						<view class="item dis al_c">
							<view class="title">实付金额</view>
							<view class="value" style="color:#F44850 ;">￥{{Number(detail.payMoney).toFixed(2)}}</view>
						</view>
						<view class="item dis al_c" style="margin-bottom: 0;">
							<view class="title">支付方式</view>
							<view class="value">{{detail.payMoney>0?detail.payType:'卡券抵扣'}}</view>
						</view>
					</view>

					<view class="card1 dis cl al_c" v-if="(detail.orderTypeId==4 || detail.orderTypeId==2)&&detail.replacementMoney&&detail.replacementMoney!=0">
						<view class="item1 dis al_c" @click="toDetails">
							<view class="lef">{{detail.orderTypeId==4?'寄送详情':'补单详情'}}</view>
							<view class="rig dis al_c">
								<view v-if="(detail.replacementStatus==1||detail.replacementStatus==3)">待支付</view>
								<image src="/static/icon//arrow-right2.png" mode="widthFix"></image>

							</view>
						</view>
					</view>
					<view class="card contact dis al_c j_c" @click="callPhone(detail.handleOrderMobile)" v-if="current!=0&&detail.orderStatus!=-1">
						<image src="/static/icon/my1.png" mode="widthFix" ></image>
						<view>联系跑腿</view>
					</view>
				</view>

			</view>
		</scroll-view>

		<view class="botom_btn dis cl al_c" v-if="(detail.orderTypeId==4 || detail.orderTypeId==2)&&(detail.replacementStatus==1||detail.replacementStatus==3)">
			<view @click="showPaySelect=true">去支付</view>
		</view>
		<paySelect :showPaySelect="showPaySelect" isRecharge="0"  :payMoney="detail.replacementMoney" :orderCode="detail.orderCode" @payResult="payResult"
			@cancelPay="cancelPay"></paySelect>
		
		<u-popup :show="showStepDetail" :round="10" bgColor="transparent" mode="center" @close="close" @open="open">
			<view class="popup_v dis cl al_c">
				<swiper class="swiper" :current="imgCurrent" :indicator-dots="false" :autoplay="false" :interval="3000"
					:duration="1000" v-if="detail.img1List&&stepIndex==2">
					<swiper-item v-for="(item,index) in detail.img1List" :key="item">
						<view class="item_itm">
							<image :src="item" mode="aspectFill"></image>
							<view>{{imgCurrent}}/{{detail.img1List.length}}</view>
						</view>
					</swiper-item>
				</swiper>
				<swiper class="swiper" :current="imgCurrent1" :indicator-dots="false" :autoplay="false" :interval="3000"
					:duration="1000" v-if="detail.pickupOrderImage&&stepIndex==1">
					<swiper-item v-for="(item,index) in detail.pickupOrderImage" :key="item">
						<view class="item_itm">
							<image :src="item" mode="aspectFill"></image>
							<view>{{imgCurrent1}}/{{detail.pickupOrderImage.length}}</view>
						</view>
					</swiper-item>
				</swiper>
				<view class="content1 dis cl">
					<!-- <view> <text class="title">接单人</text><text >{{detail.handleOrderMobile}}</text><text class="call_btn" style="color: #2E6EEF" @click="callPhone(detail.handleOrderMobile)">联系他</text>
					</view>
					<view>{{stepText}} <text>{{stepDate}}</text></view> -->
					<view class="itm dis al_c">
						<view class="title">接单人</view>
						<view class="value">{{detail.handleOrderMobileText}}</view>
						<view class="call_btn" @click="callPhone(detail.handleOrderMobile)">联系他</view>
					</view>
					<view class="itm dis al_c">
						<view class="title">{{stepText}}</view>
						<view class="value">{{stepDate}}</view>
					</view>
				</view>
			</view>
			<image class="close" src="/static/icon/close.png" mode="widthFix" @click="showStepDetail=false"></image>
		</u-popup>
		<u-modal :title="modalText" :show="isShowModal" confirmColor="#F44850" :showCancelButton="false"
			 @confirm="confirmModal"></u-modal>
	</view>
</template>

<script>
	import headBgImg from '@/components/headBgImg.vue'
	import paySelect from '@/components/paySelect.vue'
	import checkPermission from "@/components/checkPermission.vue"
	export default {
		mixins: [checkPermission],
		components: {
			headBgImg,
			paySelect
		},
		data() {
			return {
				modalText:'',
				isShowModal:false,
				showPaySelect: false,
				navTitle: '订单详情',
				showStepDetail: false,
				detail: {},
				codeList: [],
				codeOpen: false,
				codeHeight: 0,
				closeHeight: {
					height: '280rpx',
					transition: 'all 0.5s'
				},
				defaultHeight: {
					height: '370rpx',
				},
				miniHeight: {
					height: '180rpx',
				},
				openHeight: {
					height: '',
					transition: ''
				},
				codeSum:0,
				state: '',
				current: 0,
				current1: 0, // 取消是否退款 0:已取消 ,1:已退款
				stepText: '',
				stepDate: '',
				imgCurrent: 0,
				imgCurrent1: 0,
				stepIndex: 0
			};
		},
		onLoad(opt) {
			this.orderCode = opt.orderCode
			// this.getData()
			
		},
		onShow() {
			plus.nativeUI.closeWaiting()
			if (this.orderCode) {
				this.getData()
			}
			
		},
		mounted() {

		},
		methods: {
			// 支付结果
			payResult(e) {
				console.log('支付回调结果', e)
				plus.nativeUI.closeWaiting()
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
			copyText(text) {
				uni.setClipboardData({
					data: text
				})
			},
			callPhone(phone) {
				this.checkOtherPermission('call')
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			seeStep(index) {
				this.stepText = index == 0 ? '接单时间' : index == 1 ? '取货时间' : '送达时间'
				this.stepName = index == 0 ? '接单人' : index == 1 ? '取货时间' : '送达时间'
				this.stepDate = index == 0 ? this.detail.handleOrderDate : index == 1 ? this.detail.pickupOrderDate : this
					.detail.completeDate
				this.showStepDetail = true
				this.stepIndex = index

			},
			open() {
				// console.log('open');
			},
			close() {
				this.showStepDetail = false
				// console.log('close');
			},

			stepsDetail(e) {
				console.log(e)

			},
			getData() {
				let data = {
					orderCode: this.orderCode
				}
				console.log('data=', data)
				plus.nativeUI.showWaiting()
				this.$util.request(this.$apis.getOrderDetail, data).then(r => {
					console.log('详情', r)
					setTimeout(()=>{
						plus.nativeUI.closeWaiting()
					},200)
					if (r.status) {
						r.data.handleOrderDate = r.data.handleOrderDate.substring(5, 16)
						r.data.pickupOrderDate = r.data.pickupOrderDate.substring(5, 16)
						r.data.completeDate = r.data.completeDate.substring(5, 16)
						r.data['handleOrderMobileText'] = this.$tuomin(r.data.handleOrderMobile, 'phone')
						r.data['linKMobileText'] = this.$tuomin(r.data.linKMobile, 'phone')
						r.data['integer'] = this.$getBit(r.data.payMoney).integer
						r.data['decimal'] = this.$getBit(r.data.payMoney).decimal
						if (r.data.orderDescImage != '') {
							if (r.data.orderDescImage.indexOf(';') <= -1) {
								r.data['imgList'] = [r.data.orderDescImage]
							} else {
								r.data['imgList'] = r.data.orderDescImage.split(';')
							}
						}
						if (r.data.picture != '') {
							if (r.data.picture.indexOf(';') <= -1) {
								r.data['img1List'] = [r.data.picture]
							} else {
								r.data['img1List'] = r.data.picture.split(';')
							}
						}
						if (r.data.pickupOrderImage != '') {
							if (r.data.pickupOrderImage.indexOf(';') <= -1) {
								r.data['pickupOrderImage'] = [r.data.pickupOrderImage]
							} else {
								r.data['pickupOrderImage'] = r.data.pickupOrderImage.split(';')
							}
						}
						if(r.data.pickupJson){
							let codeList = []
							let codeSum = 0
							r.data.pickupJson.forEach((item,itemIndex)=>{
								let itm = {
									'address':item.paddress,
									'addressType':'',
									'codeList':[]
								}
								item.pcodes = item.pcodes.split(',')
								item.pcodes.forEach((son,sonIndex)=>{
									let sonItm = {}
									sonItm['code'+itemIndex+sonIndex] = son
									itm.codeList.push(sonItm)
									codeSum += 1
								})
								codeList.push(itm)
							})
							console.log('codeSum==',codeSum)
							this.codeList = codeList
							this.codeSum = codeSum
							this.sumCodeHight(this.codeList)
						}
						let orderStatus = r.data.orderStatus
						let replacementStatus = r.data.replacementStatus
						this.detail = r.data

						console.log('detail=', this.detail)
						this.state = orderStatus == 0 ? '待接单' : orderStatus == 2 || orderStatus == 1 ? '服务中' :
							'已完成'
						this.current = Number(orderStatus)
						this.current1 = (r.data.orderStatus == -1 && r.data.isRefund == 2) ? 1 : 2
						console.log('current=', this.current)
						let navTitle = orderStatus == -1 ? '已取消' : orderStatus == 0 ? '待接单' : orderStatus == 1 ?
							'服务中' : (replacementStatus ==
								0 && orderStatus == 2) ? '服务中' : ((replacementStatus == 1||replacementStatus == 3) && orderStatus == 2&&r.data.orderTypeId==4) ?
							'待支付快递费' :((replacementStatus == 1||replacementStatus == 3) && orderStatus == 2&&r.data.orderTypeId==2) ?'待支付补单费': (replacementStatus == 2 && orderStatus == 2) ? '服务中' : '已完成'
						this.navTitle = navTitle

					}else{
						this.modalText = r.statusMessage
						this.isShowModal = true
						// this.$toast(r.statusMessage)
					}
				})
			},
			click(e) {

			},
			preView(index) {
				uni.previewImage({
					urls: this.detail.imgList,
					current: index
				})
			},
			toDetails() {
				uni.navigateTo({
					url: './details?orderCode=' + this.detail.orderCode
				})
			},
			confirmModal(){
				uni.navigateBack()
			},
			sumCodeHight(list) {
				let codeHeight = 0
				let addNum = this.codeSum<=12?98:100
				list.forEach(item => {
					if (item.codeList.length) codeHeight += 98
					item.codeList.forEach(son => {
						codeHeight += addNum
					})
				})
				codeHeight = codeHeight > 230 ? codeHeight : 230
				let openHeight = {
					height: codeHeight + 'rpx',
					transition: 'all 0.5s'
				}
				console.log('openHeight=',openHeight)
				this.openHeight = openHeight
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 750rpx;
		background-color: whitesmoke;
		
	}

	.close {
		width: 80rpx;
		height: 80rpx;
		margin: 41rpx 0 0 279rpx;
	}

	.popup_v {
		width: 640rpx;

		background: #FFFFFF;
		border-radius: 32rpx;
		padding: 6rpx 0;

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



		.content1 {
			width: 592rpx;
			margin: 0 24rpx 15rpx 24rpx;

			.itm {
				margin: 15rpx 0;

				.title {
					width: 130rpx;
					font-size: 32rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #999999;
				}

				.value {
					font-size: 32rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					width: 335rpx;
					margin-left: 28rpx;
				}

				.call_btn {
					font-size: 28rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #2E6EEF;
				}
			}

		}
	}

	.head {
		width: 750rpx;
		height: 150rpx;
		justify-content: center;
		// background-color: #fff;

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
				font-size: 24rpx;

				margin-left: 110rpx;
			}

			.color1 {
				color: #2E6EEF;
			}

			.color2 {
				color: #fff;
				opacity: 0;
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

				.t3 {
					font-size: 24rpx;
				}

				.t4 {
					font-size: 36rpx;
				}
			}
		}
	}

	.line {
		width: 750rpx;
		height: 1rpx;
		border-bottom: 1rpx solid #eee;
		margin: 20rpx 0;
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

		.value {
			// margin-left: 20rpx;
			color: #666666;
		}
	}

	.card {
		width: 686rpx;
		padding: 24rpx 0;
		border-radius: 24rpx;
		background: #FFFFFF;
		margin-bottom: 16rpx;
	}

	.add1 {
		align-items: flex-start;

		.title {
			// padding: 10rpx 0;
		}



		.value {
			// padding: 15rpx;
			// background-color: whitesmoke;
			border-radius: 12rpx;
			width: 400rpx;

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

	.card1 {
		width: 686rpx;
		height: 112rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-bottom: 20rpx;
	}

	.item1 {
		width: 686rpx;
		height: 112rpx;
		justify-content: space-between;

		.lef {
			font-size: 32rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			margin-left: 24rpx;
		}

		.rig {
			margin-right: 24rpx;

			view {
				font-size: 32rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #F44850;

			}

			image {
				width: 22rpx;
				height: 22rpx;
				margin-left: 15rpx;
			}
		}
	}

	.call_btn {
		color: #2E6EEF;
		font-size: 28rpx;
		margin-left: 16rpx;
	}

	.open-icon {
		position: relative;
		width: 638rpx;
		justify-content: center;
		margin-top: 20rpx;
		// text-align: center;
	}

	.btm {
		// position: absolute;
		left: 0;
		bottom: 0rpx;
		width: 210rpx;
		height: 48rpx;
		background: #F8F8F8;
		border-radius: 24rpx;
		justify-content: center;
		view{
			font-size: 24rpx;
			font-family: PingFang SC-常规体, PingFang SC;
			font-weight: normal;
			color: #999999;
		}
		.btm_open {
			width: 32rpx;
			height: 32rpx;
		}
	}


	.code_list {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 638rpx;
		margin-top: 22rpx;
		// background-color: whitesmoke;
		// padding: 16rpx;
		// border-radius: 12rpx;
		overflow: hidden;
		border-top: 1rpx solid #F0F0F0;

		.top-view {
			width: 638rpx;
			margin: 12rpx 0 0 0;
			.top1 {
				width: 638rpx;
				// height: 78rpx;
			
				image {
					width: 48rpx;
					height: 48rpx;
					margin-right: 16rpx;
				}
			
				view {
					max-width: 550rpx;
					font-size: 28rpx;
					color: #333;
					// font-weight: normal;
				}
			}
		}

		.add {
			// width: 100%;
			// justify-content: flex-end;

			image {
				width: 39rpx;
				height: 39rpx;
			}

		}

		.item {
			width: 600rpx;
			margin-bottom: 12rpx;

			

			.code_v {
				width: 638rpx;
				margin-top: 20rpx;
				justify-content: space-between;

				.lef {
					width: 638rpx;
					height: 80rpx;
					font-size: 26rpx;
					color: #666666;
					background: #F8F8F8;
					border-radius: 8rpx;
					padding-left: 16rpx;

					text {
						color: #333;
						font-weight: 600;
						margin-left: 20rpx;
					}
				}

				.rig {
					width: 80rpx;
					height: 80rpx;
					justify-content: center;
					background: #F8F8F8;
					border-radius: 8rpx;

					image {
						width: 38rpx;
						height: 38rpx;
					}

				}
			}
		}
	}
	.top-text{
		width: 686rpx;
		margin-top: 30rpx;
		.tex1,.tex2{
			font-size: 28rpx;
			font-family: PingFang SC-常规体, PingFang SC;
			font-weight: normal;
			color: #666666;
			margin-bottom: 24rpx;
			text{
				font-size: 28rpx;
				font-family: PingFang SC-常规体, PingFang SC;
				font-weight: normal;
				color: #333333;
				margin-left: 16rpx;
			}
		}
	}
	.contact{
		height: 72rpx;
		justify-content: center;
		// padding: 10rpx 0;
		image{
			width: 46rpx;
			height: 46rpx;
			margin-right: 12rpx;
		}
		view{
			font-size: 32rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
		}
	}
	.u-nav-back-text{
		text{
			color: #F44850;
		}
	}
</style>
