<template>
	<view>
		<headBgImg></headBgImg>

		<view class="content dis cl al_c">
			<view class="search_v dis al_c">
				<view style="width: 614rpx;margin-left: 32rpx;" @click="toSearch">
					<u-search placeholder="搜索商品名称" :disabled="true" searchIconColor="#707070" placeholderColor="#CCCCCC"
						searchIconSize="26" bgColor="#ffffff" :showAction="false" v-model="keyword"></u-search>
				</view>
				<view class="rig_img dis cl al_c" @click="toOrder(0)">
					<image class="rig_icon" src="/static/icon/message.png" mode="widthFix"></image>
					<view class="title">我的订单</view>
				</view>
			</view>
			<!-- <image class="head_img" src="/static/images/home-bg.png" mode="aspectFill"></image> -->
			<!-- <view class="card dis">
			<view class="prog">
				<u-line-progress :percentage="100" :showText="false" height="4" activeColor="#3DBC64"
					v-if="boxInfo.deviceCode!=''"></u-line-progress>
				<u-line-progress :percentage="0" :showText="false" height="4" activeColor="#CCCCCC" v-else>
				</u-line-progress>
				<view>电量: {{boxInfo.deviceCode!=''?'100':0}}%</view>
			</view>
			<view class="open dis cl al_c">
				<image src="/static/images/open.png" mode="widthFix" @click="open" v-if="boxInfo.deviceCode!=''">
				</image>
				<image src="/static/images/no-open.png" mode="widthFix" @click="isShowModal = true" v-else></image>
				<view class="dis al_c" style="margin-left: 15rpx;" @click="addBox" v-if="">
					{{boxInfo.deviceCode!=''?boxInfo.deviceName:'去绑魔盒'}}
					<image src="/static/icon/arrow-right2.png" style="width: 28rpx;height: 28rpx;" mode=""></image>
				</view>
			</view>
			<view class="btn" @click="toBoxManage" v-if="boxInfo.deviceCode!=''">授权</view>
			<view class=" no_btn" @click="isShowModal = true" v-else>授权</view>
		</view> -->
			<view class="nav_v dis al_c">
				<view class="item dis cl al_c" @click="buyVeget" v-if="!isShenhe">
					<image class="na_img0" src="/static/icon/home/nav1.png" mode="widthFix"></image>
					<view class="title">买菜</view>
				</view>
				<view class="item dis cl al_c" @click="changetType(0)">
					<image class="na_img0" src="/static/icon/home/nav5.png" mode=""></image>
					<view class="title">淘宝</view>
				</view>
				<view class="item dis cl al_c" @click="changetType(1)">
					<image class="na_img0" src="/static/icon/home/nav6.png" mode=""></image>
					<view class="title">京东</view>
				</view>
				<view class="item dis cl al_c" @click="changetType(2)">
					<image class="na_img0" src="/static/icon/home/nav7.png" mode=""></image>
					<view class="title">拼多多</view>
				</view>
			</view>
			<view class="tabs_v">
				<u-tabs :list="tabList" :current="tabsCurrent" lineColor="#F44850" :duration="200" :activeStyle="{
		    color: '#303133',
		    fontWeight: 'bold'
		}" itemStyle="height: 80rpx;background:rgba(0,0,0,0)" @click="click"></u-tabs>
			</view>
			<view class="list_v">
				<scroll-view scroll-y="true" :scroll-top="scrollTop" :scroll-with-animation="true"
					style="width: 750rpx;height: 84vh;padding:100rpx 0 50rpx 0" @scrolltolower="tolower">
					<view class="dis cl al_c">
						<view class="page_content dis">

							<view class="left_list dis cl">
								<view class="item" v-for="(item,index) in leftList" :key="index"
									@click="toDetail(item.itemId)">
									<image class="goods_img" :src="item.itemImage" mode="aspectFill"></image>
									<view class="name dis al_c">{{item.itemTitle}}</view>
									<view class="dis al_c">
										<view class="itm_coupon" v-if="item.couponMoney">
											<image src="/static/icon/coupon.png" mode="widthFix"></image>
											<view>￥{{item.couponMoney}}券</view>
										</view>
										<view class="itm_coupon">
											<image style="width: 125rpx;" src="/static/icon/quan.png" mode="widthFix">
											</image>
											<view style="width:120rpx;color: #654200;">跑腿券x1</view>
										</view>
									</view>


									<image class="tag_img" src="/static/icon/tb.png" mode="widthFix" v-if="fromType==0">
									</image>
									<image class="tag_img" src="/static/icon/jd.png" mode="widthFix" v-if="fromType==1">
									</image>
									<image class="tag_img" style="top: 391rpx;" src="/static/icon/pdd.png"
										mode="widthFix" v-if="fromType==2"></image>
									<view class="price_v dis">
										<view class="price"><text>￥</text>{{item.strikePrice}}</view>
										<view class="old_price">{{item.itemPrice}}</view>
									</view>
								</view>
							</view>
							<view class="right_list dis cl">
								<view class="item" v-for="(item,index) in rightList" :key="index"
									@click="toDetail(item.itemId)">
									<image class="goods_img" :src="item.itemImage" mode="aspectFill"></image>
									<view class="name">{{item.itemTitle}}</view>
									<view class="dis al_c">
										<view class="itm_coupon" v-if="item.couponMoney">
											<image src="/static/icon/coupon.png" mode="widthFix"></image>
											<view>￥{{item.couponMoney}}券</view>
										</view>
										<view class="itm_coupon">
											<image style="width: 125rpx;" src="/static/icon/quan.png" mode="aspectFill">
											</image>
											<view style="width:120rpx;color: #654200;">跑腿券x1</view>
										</view>
									</view>
									<image class="tag_img" src="/static/icon/tb.png" mode="widthFix" v-if="fromType==0">
									</image>
									<image class="tag_img" src="/static/icon/jd.png" mode="widthFix" v-if="fromType==1">
									</image>
									<image class="tag_img" style="top: 391rpx;" src="/static/icon/pdd.png"
										mode="widthFix" v-if="fromType==2"></image>
									<view class="price_v dis">
										<view class="price"><text>￥</text>{{item.strikePrice}}</view>
										<view class="old_price">{{item.itemPrice}}</view>
									</view>
								</view>
							</view>
						</view>

						<view class="no_data dis cl al_c" v-if="!leftList.length&&!rightList.length">
							<image src="/static/images/no-order.png" mode="widthFix"></image>
							<view>暂无商品</view>
						</view>
					</view>
				</scroll-view>
			</view>

		</view>
	</view>
</template>

<script>
	const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
	const jdkpl = uni.requireNativePlugin("FFX-Kpl")
	let maskView = null,
		maskView1 = null
	export default {
		data() {
			return {
				keyword: '',
				tabList: [],
				fromType: 0, // 0淘宝;1京东;2拼多多
				tabsCurrent: 0,
				leftList: [],
				rightList: [],
				pageIndex: 1,
				minId: '',
				tbP: '',
				scrollTop: 0,
				isShenhe: true,
				isJump:false
			};
		},
		onShow() {
			uni.setStorageSync('lastPage', 5)
			if (uni.getStorageSync('isShenhe') == 0) {
				this.isShenhe = false
			}
			this.closeWebview()
			this.isJump = false
			if (!uni.getStorageSync('ftoken') || !uni.getStorageSync('phone')) { 
				this.showTabMask()
			}
		},
		onLoad() {
			this.tabsCurrent = 0
			plus.nativeUI.showWaiting()
			this.getTab()

		},
		onHide() {
			setTimeout(() => {
				this.isJump = false
				this.hideMask()
			}, 300)
		},
		mounted() {
			Alibcsdk.init(result => {
				console.log('百川初始化', result)
			});
			jdkpl.initSdk((e) => {
				console.log('京东开普勒初始化', e);
				uni.setStorageSync('jdkplInit', e)
			});
		},
		methods: {
			buyVeget() {
				uni.navigateTo({
					url: '/pages/shopping/buyVegetables'
				})
			},
			changeTab() {

			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/home/search'
				})
			},
			click(e) {
				console.log(e)
				this.tabsCurrent = e.index
				// this.scrollTop = 0
				this.pageIndex = 1
				plus.nativeUI.showWaiting()
				this.leftList = []
				this.rightList = []
				this.getGoodsList(this.tabList[this.tabsCurrent].id, 1, 1)

			},
			tolower() {
				plus.nativeUI.showWaiting()
				this.getGoodsList(this.tabList[this.tabsCurrent].id, this.minId, this.tbP)
			},
			rightClick() {

				uni.navigateTo({
					url: '/pages/home/search?current=' + this.fromType
				})
			},
			changetType(index) {
				if (index == this.fromType) {
					return
				}
				plus.nativeUI.showWaiting()
				this.fromType = index
				this.tabsCurrent = 0
				this.tabList = []
				this.leftList = []
				this.rightList = []
				this.pageIndex = 1
				this.getTab()
			},
			toDetail(id) {
				if (!this.$checkLogin()) return;
				plus.nativeUI.showWaiting()
				setTimeout(r => {
					plus.nativeUI.closeWaiting()
				}, 1000)
				if (this.fromType == 2) { // 拼多多判断授权
					if (!uni.getStorageSync('pddPromstatus')) {
						this.$util.request(this.$apis.queryPddMemberAuthority).then(r => {
							console.log('查询拼多多授权', r)
							if (r.resultValue != 0) {
								this.getInfo()
								this.toPddDetail(id)
								return;
							}
							this.$util.request(this.$apis.pddAuthorize).then(r => {
								console.log('生成拼多多授权', r)
								if (r.status) {
									plus.share.getServices(res => {
										this.sweixin = res.find(i => i.id === 'weixin')
										if (this.sweixin) {
											// 分享跳转到微信小程序
											this.sweixin.launchMiniProgram({
												id: r.data
													.user_name, // 	关联微信小程序的原始ID（"g_"开头的字符串）
												path: r.data
													.page_path, //	打开小程序的页面路径，不传默认跳转首页
												type: 0 // 	微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
											}, res => {
												console.log('成功唤起微信小程序');
											}, err => {
												console.log('失败');
											})
										} else {
											// 没有获取到微信分享服务
											if (plus.runtime.isApplicationExist({
													pname: 'com.xunmeng.pinduoduo',
													action: 'pinduoduo://'
												})) {
												// 应用已安装，打开相关转链页面
												plus.runtime.openURL(r.data.schemaUrl)
											} else {
												//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
												plus.runtime.openURL(r.data.url)
											}
										}
									}, err => {
										// 获取分享服务列表失败
										if (plus.runtime.isApplicationExist({
												pname: 'com.xunmeng.pinduoduo',
												action: 'pinduoduo://'
											})) {
											// 应用已安装，打开相关转链页面
											plus.runtime.openURL(r.data.schemaUrl)
										} else {
											//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
											plus.runtime.openURL(r.data.url)
											setTimeout(rr => {
												uni.navigateTo({
													url: '/pages/home/web'
												})
											}, 100)
										}
									});




									setTimeout(rr => {
										this.getInfo()
									}, 1000)
								}
							})
						})
					} else {
						this.toPddDetail(id)
					}
					return;
				} else if (this.fromType == 1) {
					let data = {
						itemFrom: this.fromType,
						para: id
					}
					this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
						console.log('jd转链', r.data)
						if (r.status) {
							if (plus.runtime.isApplicationExist({
									pname: 'com.jingdong.app.mall',
									action: 'openApp.jdMobile://'
								})) {
								jdkpl.openUrl({
									url: r.data.schemaUrl
								}, (e) => {
									console.log(e);
									// e=> {"code":0/1,"message":"打开失败/成功"}
								});
							} else {
								//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
								this.$toast('应用未安装，请先安装应用')
								// console.log("应用未安装");
							}

						} else {
							this.$toast(r.statusMessage)
						}

					})

					return;
				} else if (this.fromType == 0) {
					if (!uni.getStorageSync('taobaoRelationId')) { // 淘宝判断授权

						Alibcsdk.login(
							result => {
								console.log(result)
								if (result.status) {
									// 固定测试
									// Alibcsdk.getpublisher({
									// 	url: 'https://oauth.taobao.com/authorize?response_type=code&client_id=31330819&redirect_uri=https%3A%2F%2Fwww.zhaijiaeat.com%2Fother%2FTaobaoAuthTest&state=40_515faf71-bb81-4016-b3e8-d552d3efd3f1&view=wap',
									// }, result => {
									// 	console.log('tb-callBack', result)
									// 	// if(!result.status){
									// 	// 	this.$toast(result.msg)
									// 	// }
									// 	setTimeout(res => {
									// 		this.getInfo()
									// 	}, 1000)
									// });
									// return;
									this.$util.request(this.$apis.taobaoAuthorize).then(r => {
										console.log('tb授权接口返回', r)
										Alibcsdk.getpublisher({
											url: r.resultValue,
										}, result => {
											console.log('tb-callBack', result)
											// if(!result.status){
											// 	this.$toast(result.msg)
											// }
											setTimeout(res => {
												this.getInfo()
											}, 1000)
										});

									})

								}

								// this.showMsg(JSON.stringify(result))
							}
						)
					} else {
						// 转链
						let data = {
							itemFrom: this.fromType,
							para: id
						}
						this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
							console.log('tb转链', r.data.schemaUrl)
							if (r.status) {
								Alibcsdk.openurl({
									url: r.data.schemaUrl,
									nativeFailedMode: 'download'
								}, result => {
									console.log('plug.openurl', result)
								});

							} else {
								this.$toast(r.statusMessage)
							}

						})
					}
				} else if (this.fromType == 3 || this.fromType == 4) {
					let data = {
						code: this.fromType == 3 ? 'elem' : 'meituan'
					}
					this.$util.request(this.$apis.getActivityUrl).then(r => {
						console.log('美团/饿了么', r)
						if (r.status) {
							// 应用已安装，打开相关转链页面
							plus.runtime.openURL(r.data.schemaUrl)
						}

					})
				}



			},
			toPddDetail(id) {
				// 转链
				let data = {
					itemFrom: this.fromType,
					para: id
				}
				this.$util.request(this.$apis.postHighComission, data, 'POST').then(r => {
					console.log('pdd转链', r)
					if (r.status) {
						if (plus.runtime.isApplicationExist({
								pname: 'com.xunmeng.pinduoduo',
								action: 'pinduoduo://'
							})) {
							// 应用已安装，打开相关转链页面
							plus.runtime.openURL(r.data.schemaUrl)
						} else {
							//在这里可以进行些针对未安装情况的操作,例如隐藏相应的功能
							plus.runtime.openURL(r.data.shortUrl)
						}

					} else {
						this.$toast(r.statusMessage)
					}

				})
			},
			getInfo() {
				this.$util.request(this.$apis.getUserInfo).then(res => {
					console.log('用户信息', res)
					if (res.status) {
						uni.setStorageSync('userId', res.data.userId)
						uni.setStorageSync('taobaoRelationId', res.data.taobaoRelationId)
						uni.setStorageSync('pddPromstatus', res.data.pddPromstatus)

					}
				})
			},
			getTab() {
				let data = {
					itemFrom: this.fromType
				}
				this.$util.request(this.$apis.getProductCategory, data).then(r => {
					console.log('类目', r)
					if (r.status) {
						this.tabList = r.data
						this.getGoodsList(r.data[0].id, this.pageIndex)
					} else {
						plus.nativeUI.closeWaiting()
						this.$toast(r.statusMessage)
					}

				})
			},
			getGoodsList(id, pageIndex, tbP) {
				let data = {
					cid: id,
					itemFrom: Number(this.fromType),
					minId: pageIndex,
					tbP: tbP
				}
				console.log('列表data=', data)
				this.$util.request(this.$apis.itemList, data).then(res => {
					console.log('列表', res)

					if (res.data.length) {
						let length = res.data.length
						let list = res.data
						this.minId = res.minId
						this.tbP = res.tbP
						if (pageIndex == 1) {
							if (res.data.length % 2 == 0) {
								this.leftList = list.slice(0, length / 2)
								this.rightList = list.slice(length / 2, list.lenght)
							} else {
								this.leftList = length > 1 ? list.slice(0, (length + 1) / 2) : list
								this.rightList = length > 1 ? list.slice((length + 1) / 2, list.lenght) : []
							}
						} else if (pageIndex != 1) {
							if (res.data.length % 2 == 0) {
								this.leftList = this.leftList.concat(list.slice(0, length / 2))
								this.rightList = this.rightList.concat(list.slice(length / 2))

							} else {
								this.leftList = this.leftList.concat(length > 1 ? list.slice(0, (length) /
									2) : list)
								this.rightList = this.rightList.concat(length > 1 ? list.slice((length) /
									2 + 1) : [])
							}
							this.pageIndex = pageIndex
						}

					}
					setTimeout(() => {
						plus.nativeUI.closeWaiting()
					}, 300)
				})
			},
			toOrder() {
				if (!this.$checkLogin()) return;
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			closeWebview() {
				plus.webview.close('test');
			},
			jumpDestination(e) {
				console.log('--------')
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
				console.log('-----------')
				if (!maskView) {
					maskView = new plus.nativeObj.View('test', {
						bottom: '0px',
						left: '25%',
						height: '7%',
						width: '25%'
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
					console.log('22222222')
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
	page {
		position: fixed;
		width: 750rpx;
		background-color: #F0F0F0;
		padding-bottom: 100rpx;
	}

	.search_v {
		width: 750rpx;
		// height: 150rpx;
		padding-top: 100rpx;
		position: fixed;
		top: 0;

		.rig_icon {
			width: 48rpx;
			height: 48rpx;

		}

		.rig_img {
			position: relative;
			margin-left: 20rpx;

			.title {
				font-size: 20rpx;
				color: #999;
			}

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

	.nav_v {
		width: 750rpx;
		justify-content: space-around;
		margin-top: 197rpx;

		// margin-top: 28rpx;
		.item {
			margin-top: 28rpx;

			.na_img0 {
				width: 88rpx;
				height: 88rpx;
			}

			view {
				font-size: 24rpx;
				color: #0C0C0C;
				margin-top: 12rpx;
			}
		}
	}

	.tabs {
		margin-top: 28rpx;
	}

	.tabs_v {
		width: 750rpx;
		// height: 80rpx;
		// background-color: #f0f0f0;
		// margin-top: 36rpx;
		position: fixed;
		top: 370rpx;
		left: 0;
		z-index: 999;
	}

	.list_v {
		position: fixed;
		top: 370rpx;
		z-index: 10;
	}

	.page_content {
		width: 750rpx;
		justify-content: space-around;
		overflow: hidden;
		position: relative;
		z-index: 1;
	}

	.page_content .item {
		width: 100%;
		min-height: 370rpx;
		border-radius: 12rpx;
		background-color: white;
		margin: 20rpx 0;
		position: relative;

	}

	.item .tag_img {
		width: 60rpx;
		height: 40rpx;
		position: absolute;
		left: 18rpx;
		top: 387rpx;
		z-index: 9999;
	}

	.item .itm_coupon {
		position: relative;
		margin-left: 18rpx;

		image {

			width: 110rpx;
			height: 40rpx;
			z-index: 98rpx;
		}

		view {
			width: 100rpx;
			height: 40rpx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			font-size: 24rpx;
			color: #fff;
			z-index: 99;
			line-height: 40rpx;
		}
	}


	.item .goods_img {
		width: 100%;
		height: 360rpx;
		border-top-left-radius: 12rpx;
		border-top-right-radius: 12rpx;
		// /* background-color: whitesmoke; */
	}

	.item .name {
		width: 320rpx;
		margin: 12rpx 18rpx;
		font-size: 26rpx;
		color: #333;
		text-indent: 2.5em;
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-wrap;
	}




	.item .sale {
		margin: 0 0 12rpx 18rpx;
		font-size: 24rpx;
		color: #999999;
	}

	.item .price_v {
		margin: 0 0 12rpx 18rpx;
	}

	.item .price_v .price {
		font-size: 34rpx;
		color: red;
		font-weight: 550;
		margin-right: 12rpx;
	}

	.item .price_v .price text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.item .price_v .old_price {
		font-size: 26rpx;
		color: #dcdcdc;
		margin-top: 10rpx;
		text-decoration: line-through;
	}


	.left_list,
	.right_list {
		width: 345rpx;
		/* background-color: white; */
	}

	.dis {
		display: flex;
	}

	.cl {
		flex-direction: column;
	}

	.tabs_v {
		width: 750rpx;
		// height: 80rpx;
		// background-color: #f0f0f0;
		// margin-top: 36rpx;
		position: fixed;
		// top: 140rpx;
		left: 0;
		z-index: 999;
	}

	.no_data {
		width: 750rpx;
		margin-top: 300rpx;

		image {
			width: 220rpx;
			height: 220rpx;
		}

		view {
			font-size: 28rpx;
			color: #333;
			margin-top: 16rpx;
		}
	}
</style>