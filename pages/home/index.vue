<template>
	<view class="content dis cl al_c">
		<view class="search_v dis al_c">
			<view class="communitName dis" @click="toBind">{{userState!='ONLY_REGISTER'?communitName:bindCommunit}}
				<image src="/static/icon/select-bottom.png" style="width: 25rpx;height:25rpx;margin:6rpx 0 0 10rpx"
					mode="aspectFill" v-if="userState=='ONLY_REGISTER'"></image>
			</view>
			<view class="rig_img">
				<image class="rig_icon" src="/static/icon/message.png" mode="widthFix" @click="message"></image>
				<view class="box">
					<u-badge class="badge" numberType="overflow" type="error" max="99" :value="unReadMsg"></u-badge>
				</view>
			</view>
		</view>
		<image class="head_img" src="/static/images/home-bg.png" mode="aspectFill"></image>
		<view class="card dis al_c">
			<view class="add dis al_c" v-if="userState!='BIND_DEVICE'" @click="addBox(1)">
				<image src="/static/icon/home/add.png" mode="widthFix"></image>
				<view>绑定魔盒</view>
			</view>
			<view class="lef-info dis al_c" @click="toBoxList" v-if="userState=='BIND_DEVICE'">
				<image class="img" src="/static/images/box-img.png" mode="widthFix"></image>
				<view class="info dis cl">
					<view class="name dis al_c">{{boxInfo.deviceName || '我的魔盒'}} </image>
					</view>
					<view class="prog dis al_c">
						<view class="line-progress">
							<u-line-progress :percentage="devVol" :showText="false" height="7" activeColor="#3DBC64"
								v-if="userState=='BIND_DEVICE'"></u-line-progress>
							<u-line-progress :percentage="0" :showText="false" height="7" activeColor="#CCCCCC" v-else>
							</u-line-progress>
						</view>

						<!-- <view class="text">电量: {{boxInfo.deviceCode!=''?'100':0}}%</view> -->
					</view>
				</view>
			</view>
			<view class="open dis cl j_c al_c" v-if="userState=='BIND_DEVICE'" @click="open(0)">
				<image src="/static/icon/home/lock.png" mode="widthFix"></image>
				<view>开锁</view>
			</view>

		</view>

		<view class="swiper">
			<u-swiper :current="current" :list="swiperList" bgColor="#f0f0f0" height="87" :autoplay="true"
				:circular="true" radius="14" duration="1000" interval="3200" :loading="isBannerLoading"
				keyName="pictureUrl" imgMode="widthFix" @change="e => current = e.current">
				<view slot="indicator" class="indicator">
					<view class="indicator__dot" v-for="(item, index) in swiperList" :key="index"
						:class="[index === current && 'indicator__dot--active']">
					</view>
				</view>
			</u-swiper>
		</view>
		<view class="btn-cell dis">
			<view class="item dis al_c" @click="navigit(0)">
				<view class="title">取快递</view>
				<image class="na_img0" src="/static/icon/home/kuaidi.png" mode="widthFix"></image>
			</view>
			<view class="item r dis al_c" @click="navigit(1)">
				<view class="title">取外卖</view>
				<image class="na_img0" src="/static/icon/home/waimai.png" mode="widthFix"></image>
			</view>
			<view class="item dis al_c" @click="navigit(2)">
				<view class="title">代买商品</view>
				<image class="na_img0" src="/static/icon/home/gouwu.png" mode="widthFix"></image>
			</view>
			<view class="item r dis al_c" @click="navigit(3)">
				<view class="title">代寄快递</view>
				<image class="na_img0" src="/static/icon/home/jison.png" mode="widthFix"></image>
			</view>
			<view class="item dis al_c" @click="navigit(4)">
				<view class="title">万能帮</view>
				<image class="na_img0" src="/static/icon/home/wanneng.png" mode="widthFix"></image>
			</view>
		</view>
		<u-popup :show="isShowAd&&adObj.status!=0" mode="center">
			<view class="ad-v">
				<image :src="adObj.url || '/static/images/goods1.jpg'" mode="aspectFill"></image>
				<view class="count-down" @click="stopCount">{{countNum}}s 跳过</view>
			</view>
		</u-popup>
		<uni-popup ref="popup" type="center">
			<view class="update-view dis cl al_c" style="border-radius: 16rpx;">
				<view class="title">{{updateTitle}}</view>
				<view class="text">{{updateText}}</view>
				<view class="btn" @click="downNewVersion">确定</view>
			</view>
		</uni-popup>
		<u-modal :title="modalText" :show="isShowModal" confirmColor="#F44850" :showCancelButton="isShowCancel"
			@cancel="isShowModal=false" @confirm="confirmModal"></u-modal>
		<u-modal :title="modalText" :content="modalContent" :confirm-text="confimrmBtn" :cancel-text="bindCancelBtn"
			:show="isShowBind" :closeOnClickOverlay="true" confirmColor="#F44850" :showCancelButton="isShowCancel"
			@cancel="toBindCommunit" @confirm="addBox" @close="isShowBind=false"></u-modal>

	</view>
</template>

<script>
	// const scannerG = uni.requireNativePlugin('Ba-Scanner-G')
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const univerifyManager = uni.getUniverifyManager()
	import permision from "@/js_sdk/wa-permission/permission.js"
	import checkPermission from "@/components/checkPermission.vue"
	import mixin from '@/common/mixin.js'
	let maskView = null,
		maskView1 = null
	export default {
		mixins: [mixin, checkPermission], //混入文件
		data() {
			return {
				current: 0,
				isShowModal: false,
				isShowAd: false,
				isShowCancel: true,
				modalText: '暂未绑定设备，是否去绑定设备？',
				isBind: false,
				communitName: '',
				communityId: '',
				bussinessMobile: '',
				confimrmBtn: '绑定设备',
				bindCancelBtn: '绑定小区',
				bindCommunit: '绑定小区',
				boxInfo: {
					deviceCode: ''
				},
				boxState: 0,
				keyword: '',
				list1: [{
					name: '综合'
				}, {
					name: '销量'
				}, {
					name: '价格'
				}],
				isShenhe: true,
				isGetVersion: 0,
				swiperList: [],
				isBannerLoading: true,
				unReadMsg: 0,
				countNum: 5,
				devVol: 100,
				adObj: {
					status: 0,
					url: ''
				},
				deviceTest: false,
				isShowUpdate: false,
				updateTitle: '',
				updateText: '',
				enabledForceUpdate: '',
				modalContent: '',
				isShowBind: false,
				confirmBtn: '确定',
				cancelBtn: '取消',
				userState: 'ONLY_REGISTER',
				isJump:false,
			};
		},
		onLoad() {
			// this.upData()
			if (uni.getStorageSync('ftoken') && uni.getStorageSync('phone')) {
				this.getVolNum()
			}
		},

		onUnload() {
			uni.$off('oneLoginEvent')
			
		},
		onReady() {
			Alibcsdk.init(result => {
				// console.log('百川初始化', result)
			});
		},
		onShow() {
			
			this.bindCommunit = uni.getStorageSync('bindCommunit') ? uni.getStorageSync('bindCommunit') : this.bindCommunit
			uni.showTabBar()
			uni.setStorageSync('lastPage', 0)
			this.isJump = false
			this.upData()
			this.closeWebview()

		},
		onHide() {
			setTimeout(() => {
				this.isJump = false
				this.hideMask()
			}, 300)

		},
		mounted() {

		},
		methods: {
			getAdUrl() {
				this.$util.request(this.$apis.ymdjAdvertisement).then(r => {
					// console.log('开锁广告', r)
					if (r.status) {
						let adObj = {
							url: r.resultValue.substring(2, r.resultValue.length),
							status: r.resultValue.substring(0, 1)
						}
						// console.log('adObj', adObj)
						this.adObj = adObj
						// this.countChange()
					}
				})
			},
			stopCount() {
				this.isShowAd = false
				uni.showTabBar()
				this.countNum = 5
			},
			countChange(e) {
				uni.hideTabBar()
				this.isShowAd = true
				let countDown = setInterval(() => {
					if (this.countNum > 0) {
						this.countNum -= 1
					} else {
						clearInterval(countDown)
						this.isShowAd = false
						uni.showTabBar()
						this.countNum = 5
					}
				}, 1000)
			},
			upData() {
				uni.getNetworkType({
					success: (res) => {
						if (res.networkType == 'none') {
							setTimeout(() => {
								this.getBanner()
							}, 3500)
						} else {
							this.getBanner()
						}
					}
				})
				if (!uni.getStorageSync('ftoken') || !uni.getStorageSync('phone')) {
					this.showTabMask()
					this.userState = 'ONLY_REGISTER'
					this.unReadMsg = 0
				} else {
					this.hideMask()
					this.getUserState()
					this.getMsg()
					this.getInfo()
					this.getAdUrl()
					this.getUnpay()
				}
				if (this.$apis.env == 'dev') {
					uni.setStorageSync('isShenhe', 0)
					this.isShenhe = false
				} else {
					uni.setStorageSync('isShenhe', 1) // 默认规避审核状态
					this.checkVersion()
				}

			},
			toSearch() {
				if (!this.$checkLogin()) return;
				uni.navigateTo({
					url: './search'
				})
			},
			change() {

			},
			click() {

			},
			// 用户使用状态 ONLY_REGISTER:仅注册;
			// 			   BIND_COMMUNITY_UNUSABLE:绑定小区（免设备关）;
			// 			   BIND_COMMUNITY_USABLE:绑定小区（免设备开）;
			// 			   BIND_DEVICE:绑定设备;
			getUserState() {
				this.$util.request(this.$apis.getUserStatus).then(r => {
					console.log('用户使用状态', r)
					if (r.status) {
						this.userState = r.statusCode
						uni.setStorageSync('userState', r.statusCode)
					}
				})
			},
			getDeviceType(communityId) {
				// this.$util.request(this.$apis.getDeviceType + '/' + communityId).then(r => {
				// 	// console.log('设备类型',r)
				// })
			},
			getBanner() {
				let data = {
					adSpace: 'YMDJ_USER',
					platform: 6
				}
				this.$util.request(this.$apis.getAdSpaceAd, data).then(r => {
					// console.log('广告位', r)
					if (r.status) {

						this.swiperList = r.data
						this.isBannerLoading = false
					}
				})
			},
			getInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					console.log('用户信息', res)
					if (res.status) {
						uni.setStorageSync('phone', res.data.mobile)
						uni.setStorageSync('userId', res.data.userId)
						uni.setStorageSync('taobaoRelationId', res.data.taobaoRelationId)
						uni.setStorageSync('pddPromstatus', res.data.pddPromstatus)
						// 若切换账号则清除电量
						if (uni.getStorageSync('voltage')) {
							if (uni.getStorageSync('voltage').phone != res.data.mobile) {
								uni.removeStorageSync('voltage')
							}
						}
					}
				})
				// console.log('----')
				this.$util.request(this.$apis.getUserBindDevice).then(res => {
					// console.log('首页设备数据', res)
					if (res.status) {
						this.boxState = res.resultValue
						if (res.data && res.data != null) {
							this.boxInfo = res.data

						} else {
							this.boxInfo = {
								deviceCode: ''
							}
							uni.setStorageSync('boxInfo', res.data)
						}
						uni.setStorageSync('boxInfo', this.boxInfo)
					}
				})
				this.$util.request(this.$apis.getReceiveAddressList).then(r => {
					console.log('设备列表', r)
					if (r.data.length) {
						r.data = r.data ? r.data : []
						this.communitName = r.data[0].communityName
						this.communityId = r.data[0].communityId
						this.getDeviceType(r.data[0].communityId)

						if (r.data[0].communityId) {
							this.$util.request(this.$apis.getCommunitySetting, {
								communityId: r.data[0].communityId
							}).then(r => {
								console.log('小区配置', r)
								if (r.status) {
									this.bussinessMobile = r.data.bussinessMobile
								}
							})
						}

					}
				})

			},
			getVolNum() {
				if (uni.getStorageSync('voltage')) {
					let vol = uni.getStorageSync('voltage').volNum
					// console.log('vol', vol)
					vol = vol > 6 ? 6 : vol
					let devVol = vol > 0 ? (vol / 6) * 100 : 0
					devVol = parseInt(devVol)
					// console.log('devVol=', devVol)
					this.devVol = devVol
					if (devVol <= 10) {
						this.modalText = '电量低于10%，请尽快更换电池'
						this.isShowCancel = false
						this.isShowModal = true
					}
					// console.log('剩余电量', devVol + '%')
				}

			},
			getMsg() {
				this.$util.request(this.$apis.messageUnread).then(r => {
					// console.log('未读消息数', r)
					if (r.status) {
						this.unReadMsg = r.data
					}
				})
			},
			confirmModal() {
				if (this.modalText == '电量低于10%，请尽快更换电池') {
					this.isShowModal = false
					return;
				}
				if (this.userState == 'ONLY_REGISTER' || this.userState == 'BIND_COMMUNITY_UNUSABLE') {
					this.isShowBind = false
					this.addBox()
					return;
				}
				// 调用混入文件方法、属性
				if (this.isAgain) {
					this.isAgain = false
					if (this.checkType == 0) {
						this.checkBluetooth()
					} else {
						this.checkOtherPermission(this.permission)
					}
				} else {
					plus.nativeUI.showWaiting()
					this.isShowModal = false
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 1500)
					permision.gotoAppPermissionSetting()
				}
			},
			addBox(from) {
				if (!this.$checkLogin()) return;
				this.isShowBind = false
				if (this.userState == 'BIND_DEVICE') {
					this.toBoxList()
					return;
				}

				if (!from && this.userState == 'BIND_COMMUNITY_UNUSABLE') {
					uni.makePhoneCall({
						phoneNumber: this.bussinessMobile,
						success(res) {
							console.log(res)
						},
						fail(e) {
							uni.showToast({
								title: '请确认手机号是否有误',
								icon: 'none'
							})
						}
					})
					return;
				}


				if (plus.os.name === 'iOS' || uni.getStorageSync('isChangeScan') == 1) {
					uni.scanCode({
						success: (r) => {
							// console.log('扫码结果', r)
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/boxManage/add?scanCode=' + r.result
								})
							}, 300)
						},
						fail: () => {
							this.checkOtherPermission('camera')
						}
					})
				} else {
					this.checkOtherPermission('camera')
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
									url: '/pages/boxManage/add?scanCode=' + ret.resp_result
								})
							}
						})
					// scannerG.onScan({
					// 		'isShowVibrate': true,
					// 		'isShowBeep': false,
					// 		'isShowPhotoAlbum': false,
					// 		'isShowLightController': true,
					// 		'zoom': true,
					// 		'scanColor': '#F44850',
					// 		'hintText': '扫二维码/条形码',
					// 		'hintTextColor': '#ffffff',
					// 		'hintTextSize': '14'
					// 	},
					// 	(r) => {
					// 		// console.log('扫码结果', r)
					// 		if (r.result) {
					// 			uni.navigateTo({
					// 				url: '/pages/boxManage/add?scanCode=' + r.result
					// 			})
					// 		}
					// 	})
				}
			},
			open(type) { // type:0 开箱 ; type:2 读电量
				uni.$off('globleEvent');
				if (type == 0) {
					//全局事件订阅，只要订阅了事件就可以收到值
					uni.$on("globleEvent", async (res) => {
						// console.log('订阅魔盒打开事件', res); //我是全局事件订阅的调用方法
						uni.$off('globleEvent');
						if (res == 'boxOpen' && this.adObj.status == 1) {
							// console.log('弹出广告')
							plus.nativeUI.closeWaiting()
							uni.hideLoading()
							this.countChange()
						}
					})
				}
				this.checkBluetooth()

			},

			getUnpay() {
				let data = {
					type: '待支付',
					pageIndex: 1,
					pageSize: 10
				}
				this.$util.request(this.$apis.getUserOrderList, data).then(r => {
					// console.log('待支付订单', r)
					if (r.status) {
						let isUnPay = r.data.length ? 1 : 0
						uni.setStorageSync('isUnPay', isUnPay)
						if (isUnPay == 1) {
							uni.showTabBarRedDot({
								index: 3
							})
						} else {
							uni.hideTabBarRedDot({
								index: 3
							})
						}
					}
				})
			},
			openCar() {
				plug.OpenMyCart({
					"openType": 1
				}, result => {});
			},
			navigit(index) {
				if (!this.$checkLogin()) return;
				if (this.boxState == 0 && this.userState == 'ONLY_REGISTER') {
					this.modalText = '提示'
					this.modalContent = '使用前，请先进行绑定'
					this.confimrmBtn = '绑定设备'
					this.bindCancelBtn = '绑定小区'
					this.isShowCancel = true
					this.isShowBind = true
					// this.$toast('您还未绑定设备,请先添加设备')
					return;
				} else if (this.boxState == 0 && this.userState == 'BIND_COMMUNITY_UNUSABLE') {
					this.modalText = '提示'
					this.modalContent = '该小区未满足使用条件\n请联系管理员' + this.bussinessMobile
					this.confimrmBtn = '拨打'
					this.bindCancelBtn = '取消'
					this.isShowCancel = true
					this.isShowBind = true
					// this.$toast('您还未绑定设备,请先添加设备')
					return;
				}
				let tabsIndex = index == 1 ? 0 : index > 1 ? index - 1 : 0
				uni.navigateTo({
					url: '/pages/order/add?index=' + tabsIndex + '&deviceCode=' + this.boxInfo.deviceCode +
						'&navIndex=' + index + '&communityId=' + this.communityId
				})
			},
			toBoxList() {
				if (!this.$checkLogin()) return;
				uni.navigateTo({
					url: '/pages/boxManage/boxManage'
				})
			},
			toBoxManage(e) {
				if (!this.$checkLogin()) return;
				if (this.boxState == 0) {
					this.$toast('您还未绑定设备,请先绑定设备')
					return;

				}
				uni.navigateTo({
					url: '/pages/boxManage/authList?scanCode=' + this.boxInfo.deviceCode + '&deviceName=' + this
						.boxInfo.deviceName
				})
			},
			message() {
				console.log('checkLogin=', this.$checkLogin())
				if (!this.$checkLogin()) return;
				uni.navigateTo({
					url: '/pages/message/message'
				})
			},
			click() {

			},
			closeWebview() {
				// 获取所有Webview窗口
				var ws = plus.webview.currentWebview();
				plus.webview.close('test');
			},
			downNewVersion() {
				// this.doUpData(data.downloadUrl);
				let appurl =
					"market://details?id=uni.UNI8BF038B" //这个是通用应用市场，如果想指定某个应用商店，需要单独查这个应用商店的包名或scheme及参数
				plus.runtime.openURL(appurl)
			},
			toBind() {
				if (!this.$checkLogin()) return;
				if (this.boxState == 0 && this.userState == 'ONLY_REGISTER') {
					console.log('去绑定')
					uni.navigateTo({
						url: '/pages/bindCommunit/bindCommunit'
					})
				}
			},
			toBindCommunit() {
				if (!this.$checkLogin()) return;
				this.isShowBind = false
				if (this.userState == 'BIND_COMMUNITY_UNUSABLE') {
					return;
				}
				uni.navigateTo({
					url: '/pages/bindCommunit/bindCommunit'
				})
			},
			// isShow 是否自动检测版本
			checkVersion() {
				// #ifdef APP-PLUS
				this.$util.request(this.$apis.lastVersion, {
					systemCode: 'YMDJ_USER'
				}).then(resault => {
					console.log('版本内容', resault)
					let data = resault.data
					// 该状态仅代表审核状态，不进行升级判断
					let state = plus.os.name == 'iOS' ? data.appleStoreStatus : data.status;
					this.isGetVersion += 1
					plus.runtime.getProperty(plus.runtime.appid, (inf) => {
						console.log('本地版本', inf.version)
						uni.setStorageSync('version', inf.version)
						// 本地版本已是最新可用版本，不继续处理
						if (inf.version == data.enabledVersion) {
							this.isShenhe = false
							uni.setStorageSync('isShenhe', 0)
							return;
						}
						// 该版本非审核版本，不规避审核(线上版本)
						if (inf.version != data.version) {
							this.isShenhe = false
							uni.setStorageSync('isShenhe', 0)
						}
						console.log('最新可用版本', data.enabledVersion)
						console.log('最新审核版本', data.version)
						if (plus.os.name == 'iOS') {
							if (inf.version == data.version && state == 0) {
								// 该版本正在审核中
								return;
							}
							if (inf.version == data.version && state == 1) {
								// 该版本为审核通过待发布版本，需灰度测试不提示更新
								this.isShenhe = false
								uni.setStorageSync('isShenhe', 0)
								return;
							}
							// 非强制更新，且已提示过一次不再提示
							if (this.isGetVersion > 1 && data.enabledForceUpdate == 0) {
								return;
							}
							uni.showModal({
								title: "发现新版本" + data.enabledVersion,
								content: data.content,
								showCancel: data.enabledForceUpdate ? false : true,
								success: (res) => {
									if (res.confirm ==
										true) { //当用户确定更新，执行更新
										//在App Store Connect中的App Store下的app信息，可找到appleId
										let appleId = 6443444333
										plus.runtime
											.launchApplication({
												action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
											}, function(e) {

											});
									}
								}
							})
						} else {
							if (this.$apis.isChannel == 0) { // 非渠道包，不规避审核
								this.isShenhe = false
								uni.setStorageSync('isShenhe', 0)
								// return;
							}
							let vendorList = ['HUAWEI', 'Xiaomi', 'OPPO', 'Vivo']
							// 该版本为审核版本，进行审核状态判断
							if (inf.version == data.version && state == 0) {

								// 厂商对应审核状态通过，待发布，不规避审核
								if ((plus.device.vendor == 'HUAWEI' && data.huaweiStatus == 1) ||
									(plus.device.vendor == 'Xiaomi' && data.xiaomiStatus == 1) ||
									(plus.device.vendor == 'OPPO' && data.oppoStatus == 1) ||
									(plus.device.vendor == 'Vivo' && data.vivoStatus == 1)) {
									console.log('厂商-', plus.device.vendor, '审核通过')
									this.isShenhe = false
									uni.setStorageSync('isShenhe', 0)
									return;
								} else if (vendorList.indexOf(plus.device.vendor) == -1 &&
									data.huaweiStatus == 1 &&
									data.xiaomiStatus == 1 &&
									data.oppoStatus == 1 &&
									data.vivoStatus == 1) {
									// 非四大厂商，都审核通过之后不规避审核
									console.log('厂商-', plus.device.vendor, '审核通过')
									this.isShenhe = false
									uni.setStorageSync('isShenhe', 0)
								}


								return;

							}


							// 非强制更新，且已提示过一次不再提示
							if (this.isGetVersion > 1 && data.enabledForceUpdate == 0) {
								return;
							}
							// this.updateTitle = "发现新版本" + data.enabledVersion
							// this.updateText = data.content
							// this.enabledForceUpdate = data.enabledForceUpdate
							// this.$refs.popup.open()

							uni.showModal({
								title: "发现新版本" + data.enabledVersion,
								content: data.content,
								showCancel: data.enabledForceUpdate ? false : true,
								success: (res) => {
									if (res.confirm == true) { //当用户确定更新，执行更新
										// this.doUpData(data.downloadUrl);
										let appurl =
											"market://details?id=uni.UNI8BF038B" //这个是通用应用市场，如果想指定某个应用商店，需要单独查这个应用商店的包名或scheme及参数
										plus.runtime.openURL(appurl)
									}
								}
							})
						}


					});

				})
				// #endif 
			},
			jumpDestination(e) {				
				console.log('-----------',this.isJump)
				if (this.isJump) return;
				this.isJump = true
				if (!this.$checkLogin()) return;
			},
			hideMask() {
				if (maskView) {
					maskView.hide()
					maskView1.hide()
				}
			},
			showTabMask() {
				if (!maskView) {
					maskView = new plus.nativeObj.View('test', {
						bottom: '0px',
						left: '0px',
						height: '7%',
						width: '50%'
					});
					maskView1 = new plus.nativeObj.View('test', {
						bottom: '0px',
						left: '76%',
						height: '7%',
						width: '25%'
					});
					maskView.drawRect({
						color: 'rgba(255, 255, 255, 0)'
					})
					maskView1.drawRect({
						color: 'rgba(255, 255, 255, 0)'
					})
					maskView.addEventListener('click', () => {
						this.jumpDestination()
					}, false)
					maskView1.addEventListener('click', () => {
						this.jumpDestination()
					}, false)
					maskView.show()
					maskView1.show()
				} else {
					maskView.show()
					maskView1.show()
				}

			}

		},

		onPullDownRefresh() {

		},
		created() {

		}
	}
</script>

<style lang="scss">
	@import '~@/common/scss/mixins.scss';

	page {
		position: fixed;
		width: 750rpx;
		background-color: #F0F0F0;
		padding-bottom: 100rpx;
	}

	.indicator {

		@include flex(row);
		width: 666rpx;
		justify-content: flex-end;

		&__dot {
			height: 8rpx;
			width: 8rpx;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 10rpx 6rpx 0 0rpx;
			transition: background-color 0.3s;

			&--active {
				background-color: #ffffff;
			}
		}
	}

	.update-view {
		width: 640rpx;
		// height: 336rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.title {
			font-size: 32rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 550;
			color: #333333;
			margin-top: 44rpx;
		}

		.text {
			font-size: 28rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			margin-top: 24rpx;
		}

		.btn {
			width: 100%;
			height: 112rpx;
			text-align: center;
			line-height: 112rpx;
			font-size: 32rpx;
			font-family: PingFang SC-Semibold, PingFang SC;
			font-weight: 550;
			color: #2E6EEF;
			border-top: 1rpx solid #eee;
			margin-top: 64rpx;
		}
	}

	.none_data {
		width: 750rpx;
		text-align: center;
		margin-top: 200rpx;
		font-size: 28rpx;
		color: #999;
	}

	.search_v {
		width: 750rpx;
		// height: 150rpx;
		padding-top: 100rpx;
		position: fixed;
		top: 0;
		justify-content: space-between;

		.communitName {
			font-size: 30rpx;
			color: #333;
			margin-left: 36rpx;
			// image{
			// 	width: 30rpx;
			// 	height: 30rpx;
			// 	margin-left: 10rpx;
			// }
		}

		.rig_icon {
			width: 48rpx;
			height: 48rpx;
			margin-left: 20rpx;
		}

		.rig_img {
			position: relative;
			margin-right: 36rpx;

			.box {
				// width: 50rpx;
				// height: 50rpx;
				border-radius: 50rpx;
			}

			.badge {
				position: absolute;
				top: -18rpx;
				right: -28rpx;

			}
		}
	}

	.head_img {
		width: 750rpx;
		height: 632rpx;
		position: absolute;
		z-index: -1;
	}

	.card {
		width: 686rpx;
		height: 252rpx;
		background-image: linear-gradient(to right, white, rgba(255, 255, 255, .7));
		border-radius: 32rpx 32rpx 32rpx 32rpx;
		opacity: 1;
		margin-top: 197rpx;
		justify-content: space-between;

		.add {
			width: 100%;
			justify-content: center;
			text-align: center;

			image {
				width: 48rpx;
				height: 48rpx;
			}

			view {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin-left: 16rpx;
			}
		}

		.lef-info {
			margin-left: 70rpx;

			.img {
				@include setBox(132rpx, 190rpx) // width: 160rpx;
				// height: 120rpx;
			}

			.info {
				width: 270rpx;
				margin-left: 16rpx;
				justify-content: center;
				overflow: hidden;

				.name {
					font-size: 30rpx;
					color: #333;
				}
			}
		}

		.prog {
			width: 250rpx;
			margin-top: 23rpx;

			.line-progress {
				width: 116rpx;
			}

			.text {
				font-size: 22rpx;
				color: #333;
				margin-left: 18rpx;
			}
		}

		.open {
			// width: 134rpx;
			width: 121rpx;
			height: 120rpx;
			border-radius: 50%;
			background: linear-gradient(180deg, #FF4E8C 0%, #F73740 100%);
			margin-right: 70rpx;
			justify-content: center;

			image {
				// position: relative;
				// z-index: 99;
				width: 43rpx;
				height: 53rpx;
			}

			view {
				font-size: 19rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				margin-top: 9rpx;

			}
		}

		.btn {
			width: 104rpx;
			height: 52rpx;
			background: #FFE2E3;
			border-radius: 26rpx 26rpx 26rpx 26rpx;
			opacity: 1;
			text-align: center;
			line-height: 52rpx;
			font-size: 28rpx;
			color: #F44850;
			margin: 19rpx 24rpx 0 0;
		}
	}

	.nav_v {
		width: 750rpx;
		justify-content: space-around;

		// margin-top: 28rpx;
		.item {
			margin-top: 28rpx;

			.na_img0 {
				width: 96rpx;
				height: 96rpx;
			}

			view {
				font-size: 36rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin-top: 12rpx;
			}
		}
	}



	.banner {
		width: 686rpx;
		// height: 174rpx;
		margin-top: 24rpx;
	}

	.nav1 {
		margin-top: 24rpx;

		.nv_img {
			width: 64rpx;
			height: 64rpx;
		}
	}



	.list {
		width: 730rpx;
		margin-top: 24rpx;
		flex-wrap: wrap;
		padding-left: 20rpx;

		.item {
			width: 214rpx;
			height: 331rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			opacity: 1;
			margin: 11rpx;

			image {
				width: 214rpx;
				height: 214rpx;
			}

			.title {
				width: 187rpx;
				color: #333333;
				margin: 6rpx 0 0 6rpx;
				font-size: 24rpx;
				/* 强制超出不换行 */
				white-space: nowrap;
				/* 超出隐藏 */
				overflow: hidden;
				/* 文本超出显示成... */
				text-overflow: ellipsis;
			}

			.price {
				font-size: 37rpx;
				font-weight: 500;
				color: #FD5C64;
				margin-top: 3rpx;

				text {
					font-size: 24rpx;
				}
			}
		}
	}

	.no_btn {
		background-color: #EEEEEE;
		width: 104rpx;
		height: 52rpx;
		border-radius: 26rpx 26rpx 26rpx 26rpx;
		opacity: 1;
		text-align: center;
		line-height: 52rpx;
		font-size: 28rpx;
		margin: 19rpx 24rpx 0 0;
		color: #999999;
	}



	.nav1 {
		justify-content: flex-start;

		.item {
			margin: 0 70rpx;
		}

		.nav_img {
			width: 64rpx;
			height: 64rpx;
		}

	}

	.swiper {
		width: 686rpx;
		margin-top: 24rpx;
		background-color: #f0f0f0;
	}

	.btn-cell {
		width: 686rpx;
		margin-top: 28rpx;
		flex-wrap: wrap;

		.item {
			width: 330rpx;
			height: 184rpx;
			margin-bottom: 26rpx;
			border-radius: 24rpx;
			background-color: #fff;
			justify-content: space-between;

			.title {
				font-size: 34rpx;
				margin: 0rpx 0 12rpx 36rpx;
			}

			image {
				width: 120rpx;
				height: 120rpx;
				margin-right: 36rpx;
			}
		}

		.r {
			margin-left: 26rpx;
		}
	}

	.ad-v {
		@include setBox(100vw, 100vh);
		position: relative;

		image {
			@include setBox(100%, 100%);
		}

		.count-down {
			position: absolute;
			right: 36rpx;
			top: 120rpx;
			z-index: 50;
			@include setBox(147rpx, 64rpx);
			border-radius: 58rpx;
			// background-color: #fff;
			border: 2rpx solid #dcdcdc;
			line-height: 64rpx;
			@include setFont(24rpx, #333);
			text-align: center;
			color: #fff;
		}

		.skip {
			@include setBox(100rpx, 50rpx);
			border-radius: 50rpx;
			background: rgba(0, 0, 0, 0.3);
			@include setFont(24rpx, #fff);
			position: absolute;
			right: 50rpx;
			bottom: 50rpx;
			z-index: 50;
			line-height: 50rpx;
			text-align: center;
		}
	}
</style>