<template>
	<view class="content dis cl al_c">
		<headBgImg></headBgImg>
		<u-navbar title="我的魔盒" bgColor="rgba(0,0,0,0)" :safeAreaInsetTop="true" @rightClick="addBox"
			@leftClick="getBack">
			<view class="u-nav-slot" slot="left">
				<image class="u-nav-back" src="/static/icon//arrow-left.png" mode="widthFix"></image>
			</view>
			<view class="u-nav-slot" slot="right">
				<view class="u-nav-rig-text" style="color: #2E6EEF;">添加设备</view>
			</view>
		</u-navbar>
		<!-- <hx-navbar ref="hxnb" :config="config" @clickBtn="onClickBtn" /> -->
		<view v-if="list.length">
			<swiper :current="current" class="swiper-view" style="height: 565rpx;" :indicator-dots="true"
				indicator-active-color="#2E6EEF" :autoplay="false" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in list" key="item">
					<view class="swiper-item">
						<view class="card dis cl al_c">
							<view class="top dis al_c">
								<view class="t1">{{item.deviceName}}</view>
								<view class="t2" v-if="item.userType!='授权用户'"
									@click="showModal('删除后，您和您授权的用户将不可使用该设备，是否确定？',item.deviceCode)">删除设备
								</view>
								<view class="t2" v-if="item.userType=='授权用户'" @click="delAuth(item.deviceCode)">删除授权
								</view>
							</view>
							<view class="itm dis al_c"><text>设备位置：</text>
								<view class="address1">
									{{item.deviceAddress}}
								</view>
							</view>
							<view class="itm"><text>设备编号：</text>{{item.deviceCode}}</view>
							<view class="itm"><text>用户类型：</text>{{item.userType}} </view>
							<view class="itm"><text>授权时间：</text>{{item.createOn}}</view>
						</view>
					</view>
				</swiper-item>

			</swiper>

		</view>
		<view class="none_data" v-if="!list.length">暂未添加魔盒</view>
		<view class="card1 dis cl al_c">
			<!-- <view class="itm dis al_c">
				<view>设置默认</view>
				<switch :checked="isDefault" color="#F44850" @change="changeSet" />
			</view> -->
			<view class="itm dis al_c">
				<view>再次投件</view>
				<switch checked="false" color="#F44850" @change="changeSet" />
			</view>
			<view class="line"></view>
			<view class="itm dis al_c" v-if="list.length&&list[current].userType=='主用户'" @click="auth">
				<view>授权管理</view>
				<image src="/static/icon/arrow-right.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="card3 dis cl al_c">
			<view class="title" style="margin-bottom: 46rpx;"><text></text>使用记录</view>
			<scroll-view scroll-y="true" style="height: 570rpx;" v-if="logList.length">
				<block>
					<view class="date-list" v-for="(item,index) in logList" :key="item.date">
						<view class="itm-date dis al_c">
							<view class="spot"></view>{{item.date}}
						</view>
						<view class="list dis cl al_c">
							<block v-for="(son,index) in item.timeList" :key="son.time">
								<view class="time-list dis al_c">
									<view class="time">{{son.time}}</view>
									<view class="text">{{son.text}}</view>
								</view>
							</block>

						</view>

					</view>
				</block>
			</scroll-view>

			<view style="width:666rpx;text-align:center;margin-top: 200rpx;"
				v-if="list.length&&list[current].userType!='主用户'">只有主用户才能查看使用记录</view>
			<view style="width:666rpx;text-align:center;margin-top: 200rpx;" v-else-if="!logList.length">暂无使用记录</view>
		</view>
		<u-modal :title="modalText" :show="isShowModal" :showCancelButton="true" confirmColor="#F44850"
			@confirm="confirmModal" @cancel="isShowModal=false"></u-modal>
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
				isDefault: false,
				isShowModal: false,
				modalText: '',
				currentId: '',
				navBackground: {
					background: 'none'
				},
				config: {
					back: false,
					title: '我的魔盒',
					backgroundColor: [0, '#F0F0F0'],
					fontSize: '16px',
					color: '#0C0C0C',
					rightButton: [{
						key: 'btn1',
						icon: '&#xe651;',
						txt: '添加',
						position: 'left'
					}]
				},
				list: [],
				current: 0,
				pageIndex: 1,
				logList: []

			};
		},
		onLoad() {

		},
		onShow() {
			this.getData()
		},
		methods: {
			showModal(text, id) {
				this.modalText = text
				this.currentId = id
				this.isShowModal = true
			},
			confirmModal() {
				this.isShowModal = false
				if (this.modalText == '删除后，您和您授权的用户将不可使用该设备，是否确定？') {
					console.log('-----------')
					this.del(this.currentId)
				} else if (this.modalText == '开启后，魔盒在已有包裹的情况下可再次投放') {

				}
			},
			onClickBtn(e) {
				console.log(e)
			},
			getData() {
				// 获取小区设备列表
				console.log('----')
				this.$util.request(this.$apis.getDeviceList).then(res => {
					console.log('设备列表', res)
					if (res.status) {
						this.list = res.data ? res.data : []
						if (res.data.length && res.data[0].userType != '授权用户') {
							this.getLog(res.data[0].deviceCode, this.pageIndex)
						}
					}
				})
			},
			getLog(deviceCode, pageIndex) {
				let data = {
					deviceCode,
					pageIndex,
					pageSize: 50
				}
				console.log('data=', data)
				this.$util.request(this.$apis.deviceOperateRecord_list, data).then(r => {
					console.log('使用记录', r)
					if (r.status) {
						let list = r.data
						let logList = []
						list.forEach(item => {
							item['operateDate'] = item.operateDate.substr(5, item.operateDate.length - 1)
							item['operateTime'] = item.operateTime.substr(0, 5)
							let itm = {
								date: item.operateDate,
								timeList: []
							}
							if (JSON.stringify(logList).indexOf(item.operateDate) == -1) {
								logList.push(itm)
							}
						})
						console.log('logList=', logList)
						logList.forEach(item => {
							list.forEach(itm => {
								if (itm.operateDate == item.date) {
									let operateUserType = itm.operateUserType == 0 ? '主用户' : itm
										.operateUserType == 1 ? '管家' : itm
										.operateUserType == 3 ? '永久授权人员' : '一次授权人员'
									let phone = this.$tuomin(itm.operateUserMobile, 'phone')
									let son = {
										time: itm.operateTime,
										text: operateUserType + phone + '，使用了魔盒'
									}
									item.timeList.push(son)
								}
							})
						})
						console.log('logList1=', logList)
						this.logList = logList
					}
				})
			},
			auth() {
				if (this.list.length) {
					uni.navigateTo({
						url: '/pages/boxManage/authList?scanCode=' + this.list[this.current].deviceCode +
							'&deviceName=' + this.list[this.current].deviceName
					})
				} else {
					this.$toast('请先添加一个设备')
				}

			},
			del(id) {

				console.log('-----------')
				this.$util.request(this.$apis.deleteDeviceByUser, {
					deviceCode: id
				}).then(res => {
					console.log('删除设备', res)
					if (res.status) {
						this.getData()
						this.$toast('请重新绑定设备')
						setTimeout(() => {
							uni.navigateBack()
						}, 1200)
					} else {
						this.$toast(res.statusMessage)
					}
				})
			},
			delAuth(id) {
				plus.nativeUI.showWaiting()
				let data = {
					id
				}
				this.$util.request(this.$apis.deleteAuthInfo, data).then(res => {
					console.log('删除授权', res)
					plus.nativeUI.closeWaiting()
					if (res.status) {
						plus.nativeUI.closeWaiting()
						this.$toast('删除成功')
						this.getData()
					} else {
						this.$toast(res.statusMessage)
					}
				})
			},
			changeSet(e) {
				console.log('e', e)
				if (!e.target.value) {
					this.modalText = '开启后，魔盒在已有包裹的情况下可再次投放'
					this.isShowModal = true
				}
			},

			getBack() {
				uni.navigateBack()
			},

			addBox() {
				if (plus.os.name === 'iOS') {
					console.log('扫描二维码')
					uni.scanCode({
						success: (r) => {
							console.log('扫码结果', r)
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/boxManage/add?scanCode=' + r.result
								})
							}, 300)

						},
						fail(err) {
							console.log(err)
						}
					})
				} else {
					var mpaasScanModule = uni.requireNativePlugin("Mpaas-Scan-Module");
					mpaasScanModule.mpaasScan({
							// 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
							'scanType': ['qrCode'],
							// 是否隐藏相册，默认false不隐藏
							'hideAlbum': false
						},
						(ret) => {
							console.log('扫描结果', ret)
							if (ret.resp_message == 'success') {
								uni.navigateTo({
									url: './add?scanCode=' + ret.resp_result
								})
							}
						})
					// const scannerG = uni.requireNativePlugin('Ba-Scanner-G')
					// scannerG.onScan({
					// 		'isShowVibrate': true,
					// 		'isShowBeep': false,
					// 		'isShowPhotoAlbum': false,
					// 		'isShowLightController': true,
					// 		'zoom': true,
					// 		'scanColor': '#FF4E8C',
					// 		'hintText': '扫二维码/条形码',
					// 		'hintTextColor': '#ffffff',
					// 		'hintTextSize': '14'
					// 	},
					// 	(r) => {
					// 		console.log('扫码结果', r)
					// 		if (r.result) {
					// 			setTimeout(() => {
					// 				uni.navigateTo({
					// 					url: './add?scanCode=' + r.result
					// 				})
					// 			}, 300)

					// 		}


					// 	})
				}




			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		background-color: #f0f0f0;
	}

	.none_data {
		width: 750rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 200rpx;
		line-height: 300rpx;
	}

	.swiper-view {
		width: 686rpx;
		height: 335rpx;

		.swiper-item {
			width: 100%;
			min-height: 167rpx;
		}
	}

	.content {
		width: 750rpx;
	}

	.card {
		width: 686rpx;
		min-height: 335rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		opacity: 1;
		margin-top: 180rpx;

		.top {
			width: 638rpx;
			height: 97rpx;
			border-bottom: 1rpx solid #F0F0F0;
			justify-content: space-between;
			margin-bottom: 24rpx;

			.t1 {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}

			.t2 {
				width: 160rpx;
				height: 64rpx;
				border: 2rpx solid #999999;
				text-align: center;
				border-radius: 32rpx;
				line-height: 64rpx;
				font-size: 28rpx;
			}
		}

		.itm {
			width: 666rpx;
			// line-height: 80rpx;
			margin-left: 20rpx;
			font-size: 26rpx;
			color: #333;
			margin-bottom: 16rpx;

			text {
				color: #999999;
				margin-right: 30rpx;
			}

		}

	}

	.address1 {
		width: 495rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1
	}

	.card1 {
		width: 686rpx;
		// height: 338rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		opacity: 1;
		margin-top: 14rpx;

		.itm {
			width: 638rpx;
			justify-content: space-between;
			height: 112rpx;

			image {
				width: 45rpx;
				height: 45rpx;
			}
		}

		.line {
			width: 662rpx;
			height: 1rpx;
			border-bottom: 1rpx solid #eee;
		}

	}

	.card3 {
		width: 686rpx;
		min-height: 570rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		opacity: 1;
		margin-top: 16rpx;
		margin-bottom: 50rpx;

		.title {
			width: 662rpx;
			margin-top: 24rpx;
		}

		.itm {
			width: 638rpx;
			border-bottom: 1rpx solid #eee;

			.t1 {
				font-size: 28rpx;
				color: #666666;
			}

			.t2 {
				font-size: 24rpx;
				color: #333333;
				width: 550rpx;

				padding-bottom: 20rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
			}
		}

		.date-list {
			width: 638rpx;
			// background-color: gray;
			margin-bottom: 29rpx;
			margin-left: 24rpx;

			.itm-date {
				font-size: 28rpx;
				font-family: PingFang SC-中黑体, PingFang SC;
				font-weight: normal;
				color: #222222;

				.spot {
					width: 15rpx;
					height: 15rpx;
					border-radius: 50%;
					background: #F44850;
					margin-right: 21rpx;
				}
			}

			.list:last-child {
				border: none;
			}

			.time-list {
				width: 597rpx;
				height: 96rpx;
				margin-left: 28rpx;
				border-bottom: 1rpx solid #F0F0F0;

				.time {
					font-size: 24rpx;
					font-family: PingFang SC-常规体, PingFang SC;
					font-weight: normal;
					color: #666666;
				}

				.text {
					font-size: 28rpx;
					font-family: PingFang SC-常规体, PingFang SC;
					font-weight: normal;
					color: #333333;
					margin-left: 24rpx;
				}
			}

			.time-list:last-child {
				border: none;
			}

		}

		// .date-list view:last-child{
		// 	border: none;
		// }
	}
</style>